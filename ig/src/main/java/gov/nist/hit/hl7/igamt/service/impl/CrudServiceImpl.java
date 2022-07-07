package gov.nist.hit.hl7.igamt.service.impl;


import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service
public class CrudServiceImpl implements CrudService {

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ValuesetService valuesetService;
  @Autowired
  FhirHandlerService fhirHandlerService;
  @Autowired
  ResourceManagementService resourceManagementService;

  @Override
  public AddMessageResponseObject addConformanceProfiles(Set<String> ids, Ig ig)
      throws AddingException {
    AddMessageResponseObject ret = new AddMessageResponseObject();
    ConformanceProfileRegistry reg = ig.getConformanceProfileRegistry();
    if (reg != null) {
      if (reg.getChildren() != null) {
        Set<String> existants = mapLinkToId(reg.getChildren());
        ids.removeAll(existants);
        for (String id : ids) {
          ConformanceProfile cp = conformanceProfileService.findById(id);
          if (cp != null) {
            ret.getConformanceProfiles().add(cp);
            addDependecies(cp, ig, ret);
            Link link = new Link(cp, cp.getChildren().size() + 1);
            reg.getChildren().add(link);
          } else {
            throw new AddingException("Could not find conformance profile with id " + id);
          }
        }
      }
    }
    return ret;
  }

  private void addDependecies(ConformanceProfile cp, Ig ig, AddMessageResponseObject ret)
      throws AddingException {
    Set<String> segmentIds = getConformanceProfileResourceDependenciesIds(cp);
    AddSegmentResponseObject formSegment = addSegments(segmentIds, ig);
    ret.getSegments().addAll((formSegment.getSegments()));
    ret.getDatatypes().addAll(formSegment.getDatatypes());
    for (Valueset vs : formSegment.getValueSets()) {
      ret.getValueSets().add(vs);

    }
    if (cp.getBinding() != null) {
      Set<String> vauleSetBindingIds = processBinding(cp.getBinding());
      AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, ig);

      for (Valueset vs : valueSetAdded.getValueSets()) {
        if (!ret.getValueSets().contains(vs)) {
          ret.getValueSets().add(vs);
        }
      }
    }
  }

  private Set<String> getConformanceProfileResourceDependenciesIds(ConformanceProfile cp) {
    // TODO Auto-generated method stub
    Set<String> ids = new HashSet<String>();
    for (MsgStructElement segOrgroup : cp.getChildren()) {
      if (segOrgroup instanceof SegmentRef) {
        SegmentRef ref = (SegmentRef) segOrgroup;
        if (ref.getRef() != null && ref.getRef().getId() != null)
          ids.add(ref.getRef().getId());
      } else {
        processSegmentorGroup(segOrgroup, ids);
      }
    }
    return ids;

  }

  private void processSegmentorGroup(MsgStructElement segOrgroup, Set<String> ids) {
    if (segOrgroup instanceof SegmentRef) {
      SegmentRef ref = (SegmentRef) segOrgroup;
      if (ref.getRef() != null && ref.getRef().getId() != null) {
        ids.add(ref.getRef().getId());
      }
    } else if (segOrgroup instanceof Group) {
      Group g = (Group) segOrgroup;
      for (MsgStructElement child : g.getChildren()) {
        processSegmentorGroup(child, ids);
      }
    }
  }

  @Override
  public AddSegmentResponseObject addSegments(Set<String> ids, Ig ig) throws AddingException {
    AddSegmentResponseObject ret = new AddSegmentResponseObject();
    SegmentRegistry reg = ig.getSegmentRegistry();
    if (reg != null) {
      if (reg.getChildren() != null) {
        Set<String> existants = mapLinkToId(reg.getChildren());
        ids.removeAll(existants);
        for (String id : ids) {
          Segment segment = segmentService.findById(id);
          if (segment != null) {
            addDependecies(segment, ig, ret);
            Link link =
                new Link(segment, reg.getChildren().size() + 1);
            ret.getSegments().add(segment);
            reg.getChildren().add(link);
          } else {
            throw new AddingException("Could not find Segment with id" + segment.getId());
          }
        }
      }
    }
    return ret;
  }

  private void addDependecies(Segment segment, Ig ig, AddSegmentResponseObject ret)
      throws AddingException {
    // TODO Auto-generated method stub

    Set<String> datatypeIds = getSegmentResourceDependenciesIds(segment);
    if(segment.getDynamicMappingInfo() !=null && segment.getDynamicMappingInfo().getItems() !=null && !segment.getDynamicMappingInfo().getItems().isEmpty()  ) {
      addDynamicMappingDatatypesIds(segment.getDynamicMappingInfo().getItems(), datatypeIds);
    }
    AddDatatypeResponseObject fromDataypes = addDatatypes(datatypeIds, ig);

    for (Datatype d : fromDataypes.getDatatypes()) {
      ret.getDatatypes().add(d);
    }

    for (Valueset vs : fromDataypes.getValueSets()) {
      ret.getValueSets().add(vs);
    }

    if (segment.getBinding() != null) {
      Set<String> vauleSetBindingIds = processBinding(segment.getBinding());

      AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, ig);

      for (Valueset vs : valueSetAdded.getValueSets()) {
        if (!ret.getValueSets().contains(vs)) {
          ret.getValueSets().add(vs);
        }
      }
    }


  }

  /**
   * @param items
   * @param datatypeIds
   */
  private void addDynamicMappingDatatypesIds(Set<DynamicMappingItem> items, Set<String> datatypeIds) {
    for(DynamicMappingItem item: items) {
      if(item.getDatatypeId() !=null) {
        datatypeIds.add((item.getDatatypeId()));
      }
    }

  }

  private Set<String> processBinding(ResourceBinding binding) {
    Set<String> vauleSetIds = new HashSet<String>();
    if (binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        vauleSetIds.addAll(this.processStructureElementBinding(child));
      }
    }
    return vauleSetIds;
  }



  /**
   * @param child
   * @return
   */
  private Set<String> processStructureElementBinding(
      StructureElementBinding child) {
    Set<String> vauleSetIds = new HashSet<String>();
    if (child.getValuesetBindings() != null) {
      for (ValuesetBinding vs : child.getValuesetBindings()) {
        if(vs.getValueSets() !=null) {
          for(String s: vs.getValueSets()) {
            vauleSetIds.add(s);
          }
        }
      }
    }
    if(child.getChildren() !=null && !child.getChildren().isEmpty()) {
      for (StructureElementBinding subChild : child.getChildren()) {
      vauleSetIds.addAll(this.processStructureElementBinding(subChild));
      }
    }
    return vauleSetIds;
  }

  private Set<String> getSegmentResourceDependenciesIds(Segment segment) {
    // TODO Auto-generated method stub
    Set<String> ids = new HashSet<String>();
    if (segment.getChildren() != null) {

      for (Field f : segment.getChildren()) {
        if (f.getRef() != null && f.getRef().getId() != null) {
          ids.add(f.getRef().getId());
        }
      }
    }
    return ids;
  }



  @Override
  public AddDatatypeResponseObject addDatatypes(Set<String> ids, Ig ig) throws AddingException {
    // TODO Auto-generated method stub
    AddDatatypeResponseObject ret = new AddDatatypeResponseObject();
    if (ig.getDatatypeRegistry() != null) {
      if (ig.getDatatypeRegistry().getChildren() != null) {
        Set<String> existants = mapLinkToId(ig.getDatatypeRegistry().getChildren());
        ids.removeAll(existants);
        for (String id : ids) {
          Datatype datatype = datatypeService.findById(id);
          if (datatype != null) {
            if (datatype instanceof ComplexDatatype) {
              ComplexDatatype p = (ComplexDatatype) datatype;
              if (p.getBinding() != null) {
                Set<String> vauleSetBindingIds = processBinding(p.getBinding());
                AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, ig);
                for (Valueset vs : valueSetAdded.getValueSets()) {
                  if (!ret.getValueSets().contains(vs)) {
                    ret.getValueSets().add(vs);
                  }
                }
              }
              Set<String> datatypeIds = getDatatypeResourceDependenciesIds(p);
              addDatatypes(datatypeIds, ig, ret);
            }
            Link link = new Link(datatype,
                ig.getDatatypeRegistry().getChildren().size() + 1);
            ret.getDatatypes().add(datatype);
            ig.getDatatypeRegistry().getChildren().add(link);

          }else {
            throw new AddingException("Could not find Datatype with id : "+id);
          }
        }
      }
    }
    return ret;
  }


  public void addDatatypes(Set<String> ids, Ig ig, AddDatatypeResponseObject ret)
      throws AddingException {
    // TODO Auto-generated method stub
    if (ig.getDatatypeRegistry() != null) {
      if (ig.getDatatypeRegistry().getChildren() != null) {
        Set<String> existants = mapLinkToId(ig.getDatatypeRegistry().getChildren());
        ids.removeAll(existants);
        for (String id : ids) {
          Datatype datatype = datatypeService.findById(id);
          if (datatype != null) {
            if (datatype.getBinding() != null) {
              Set<String> vauleSetBindingIds = processBinding(datatype.getBinding());
              AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, ig);
              for (Valueset vs : valueSetAdded.getValueSets()) {
                if (!ret.getValueSets().contains(vs)) {
                  ret.getValueSets().add(vs);
                }
              }
            }
            Link link =
                new Link(datatype, ig.getDatatypeRegistry().getChildren().size() + 1);
            ig.getDatatypeRegistry().getChildren().add(link);
            ret.getDatatypes().add(datatype);
            if (datatype instanceof ComplexDatatype) {
              ComplexDatatype p = (ComplexDatatype) datatype;
              addDatatypes(getDatatypeResourceDependenciesIds(p), ig, ret);
            }
          } else {
            throw new AddingException("Could not find Datata type  with id " + id);
          }
        }
      }
    }
  }


  private Set<String> getDatatypeResourceDependenciesIds(ComplexDatatype datatype) {
    // TODO Auto-generated method stub
    Set<String> datatypeIds = new HashSet<String>();
    for (Component c : datatype.getComponents()) {
      if (c.getRef() != null) {
        if (c.getRef().getId() != null) {
          datatypeIds.add(c.getRef().getId());
        }
      }
    }
    return datatypeIds;

  }

  @Override
  public AddValueSetResponseObject addValueSets(Set<String> ids, Ig ig) throws AddingException {
    // TODO Auto-generated method stub
    ValueSetRegistry reg = ig.getValueSetRegistry();
    AddValueSetResponseObject ret = new AddValueSetResponseObject();
    if (reg != null) {
      if (reg.getChildren() != null) {
        Set<String> existants = mapLinkToId(reg.getChildren());
        ids.removeAll(existants);
        for (String id : ids) {
          Valueset valueSet = valuesetService.findById(id);
          if (valueSet != null) {
            Link link =
                new Link(valueSet, reg.getChildren().size() + 1);
            reg.getChildren().add(link);
            ret.getValueSets().add(valueSet);
          } else {
            throw new AddingException("Could not find Value Set  with id " + id);
          }
        }
      }
    }
    return ret;
  }


  private Set<String> mapLinkToId(Set<Link> links) {
    Set<String> ids = links.stream().map(x -> x.getId()).collect(Collectors.toSet());
    return ids;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.CrudService#AddConformanceProfilesToEmptyIg(java.util.Set,
   * gov.nist.hit.hl7.igamt.ig.domain.Ig)
   */
  @Override
  public String AddConformanceProfilesToEmptyIg(Set<String> ids, Ig ig)
      throws AddingException {
    // TODO Auto-generated method stub
    AddMessageResponseObject ret = this.addConformanceProfiles(ids, ig);


    List<AbstractDomain> ordredSegment = ret.getSegments().stream()
        .sorted((Segment t1, Segment t2) -> t1.getName().compareTo(t2.getName()))
        .collect(Collectors.toList());

    orderRegistry(ig.getSegmentRegistry(), ordredSegment);
    List<AbstractDomain> ordredDatatypes = ret.getDatatypes().stream()
        .sorted((Datatype t1, Datatype t2) -> t1.getName().compareTo(t2.getName()))
        .collect(Collectors.toList());
    orderRegistry(ig.getDatatypeRegistry(), ordredDatatypes);

    List<AbstractDomain> orderdValueSet = ret.getValueSets().stream()
        .sorted((Valueset t1, Valueset t2) -> t1.getBindingIdentifier().compareTo(t2.getBindingIdentifier()))
        .collect(Collectors.toList());

    orderRegistry(ig.getValueSetRegistry(), orderdValueSet);
    return ig.getId();
  }

  /**
   * @param conformanceProfileRegistry
   * @param ordredMessages
   */
  private void orderRegistry(Registry registry, List<AbstractDomain> list) {
    // TODO Auto-generated method stub
    HashMap<String, Integer> orderMap = new HashMap<String, Integer>();
    for (int i = 0; i < list.size(); i++) {
      orderMap.put(list.get(i).getId(), i + 1);
    }
    for (Link link : registry.getChildren()) {
      link.setPosition(orderMap.get(link.getId()));
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.CrudService#addValueSets(java.util.List, gov.nist.hit.hl7.igamt.ig.domain.Ig)
   */
  @Override
  public AddValueSetResponseObject addValueSets(List<AddingInfo> toAdd, Ig ig, String username) throws AddingException, EntityNotFound, ForbiddenOperationException {
    // TODO Auto-generated method stub
    Set<String> savedIds = new HashSet<String>();
    for (AddingInfo elm : toAdd) {
      if (elm.isFlavor()) {
        addValueSetAsFlavor(elm, savedIds,ig, username );
      } else {
        addAsIs(elm, savedIds,ig, username);
      }
    }
    AddValueSetResponseObject objects = this.addValueSets(savedIds, ig);
    return objects;

  }

  /**
   * @param elm
   * @param savedIds
   * @param ig
   * @param username
 * @throws ForbiddenOperationException 
   */
  private void addAsIs(AddingInfo elm, Set<String> savedIds, Ig ig, String username) throws ForbiddenOperationException {
    // TODO Auto-generated method stub
    if (elm.getDomainInfo() != null && elm.getDomainInfo().getScope().equals(Scope.PHINVADS)) {
      addPhinvadsAsIs(elm, savedIds,ig, username );
    } else {
      ig.getValueSetRegistry().getCodesPresence().put(elm.getId(), elm.isIncludeChildren());
      savedIds.add(elm.getId());
    }
  }

  private void addPhinvadsAsIs(AddingInfo elm, Set<String> savedIds, Ig ig, String username) throws ForbiddenOperationException {
    Valueset valueset = valuesetService.findExternalPhinvadsByOid(elm.getOid());

    if(valueset == null) {
      Valueset newValueset = new Valueset();
      DomainInfo info = new DomainInfo();
      info.setScope(Scope.PHINVADS);
      info.setVersion(elm.getDomainInfo().getVersion());
      newValueset.setDomainInfo(info);
      newValueset.setSourceType(SourceType.EXTERNAL);
      newValueset.setUsername(username);
      newValueset.setBindingIdentifier(elm.getName());
      newValueset.setUrl(elm.getUrl());
      newValueset.setOid(elm.getOid());
      newValueset.setFlavor(false);
      newValueset.setExtensibility(Extensibility.Closed);
      newValueset.setStability(Stability.Dynamic);
      newValueset.setContentDefinition(ContentDefinition.Extensional);
      Valueset saved = valuesetService.save(newValueset);
      ig.getValueSetRegistry().getCodesPresence().put(saved.getId(), elm.isIncludeChildren());
      savedIds.add(saved.getId());
    } else {
      ig.getValueSetRegistry().getCodesPresence().put(valueset.getId(), elm.isIncludeChildren());
      savedIds.add(valueset.getId());
    }

  }

  /**
   * @param elm
   * @param savedIds
   * @param ig
   * @param username
   * @throws EntityNotFound 
 * @throws ForbiddenOperationException 
   */
  private void addValueSetAsFlavor(AddingInfo elm, Set<String> savedIds, Ig ig, String username) throws EntityNotFound, ForbiddenOperationException {
    if (elm.getOriginalId() != null) {
     // Valueset valueset = valuesetService.findById(elm.getOriginalId());
        
        Valueset clone =  resourceManagementService.getElmentFormAddingInfo( username, new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT), Type.VALUESET, elm);


        clone.getDomainInfo().setScope(Scope.USER);

        clone.setUsername(username);
        clone.setBindingIdentifier(elm.getName());
        clone.setSourceType(elm.getSourceType());
        clone = valuesetService.save(clone);
        ig.getValueSetRegistry().getCodesPresence().put(clone.getId(), elm.isIncludeChildren());
        savedIds.add(clone.getId());
    } else {
      if (elm.getDomainInfo() != null && elm.getDomainInfo().getScope().equals(Scope.PHINVADS)) {
        importPhinvadsAsFlavor( elm, savedIds, ig, username);
      } else {
        createNewValueSet( elm, savedIds, ig, username);
      }
    }
  }

  /**
   * @param elm
   * @param savedIds
   * @param ig
   * @param username
 * @throws ForbiddenOperationException 
   */
  private void importPhinvadsAsFlavor(AddingInfo elm, Set<String> savedIds, Ig ig,
      String username) throws ForbiddenOperationException {
    // TODO Auto-generated method stub


    Valueset valueset = new Valueset();
    DomainInfo info = new DomainInfo();
    info.setScope(Scope.PHINVADS);
    info.setVersion(elm.getDomainInfo().getVersion());
    valueset.setDomainInfo(info);
    if (!elm.isIncludeChildren()) {
      valueset.setSourceType(SourceType.EXTERNAL);
      valueset.setCodes(new HashSet<Code>());
      valueset.setExtensibility(Extensibility.Closed);
      valueset.setStability(Stability.Dynamic);
      valueset.setContentDefinition(ContentDefinition.Extensional);
    } else {
      valueset.setSourceType(SourceType.INTERNAL);
      valueset.setExtensibility(Extensibility.Open);
      valueset.setStability(Stability.Static);
      valueset.setContentDefinition(ContentDefinition.Extensional);
      // Get codes from vocab service
      if (elm.getOid() != null) {
        Set<Code> vsCodes = fhirHandlerService.getValusetCodes(elm.getOid());
        valueset.setCodes(vsCodes);
        valueset.setCodeSystems(valuesetService.extractCodeSystemsFromCodes(vsCodes));
      }
    }
    valueset.setUsername(username);
    valueset.setBindingIdentifier(elm.getName());
    valueset.setName(elm.getDescription());
    valueset.setUrl(elm.getUrl());
    valueset.setOid(elm.getOid());
    valueset.setFlavor(true);

    Valueset saved = valuesetService.save(valueset);
    ig.getValueSetRegistry().getCodesPresence().put(saved.getId(), elm.isIncludeChildren());
    savedIds.add(saved.getId());

  }

  /**
   * @param elm
   * @param savedIds
   * @param ig
   * @param username
 * @throws ForbiddenOperationException 
   */
  private void createNewValueSet(AddingInfo elm, Set<String> savedIds, Ig ig, String username) throws ForbiddenOperationException {
    // TODO Auto-generated method stub
    Valueset valueset = new Valueset();
    DomainInfo info = new DomainInfo();
    info.setScope(Scope.USER);
    info.setVersion(null);
    valueset.setDomainInfo(info);
    if (!elm.isIncludeChildren()) {
      valueset.setSourceType(SourceType.EXTERNAL);
      valueset.setCodes(new HashSet<Code>());
    } else {
      valueset.setSourceType(SourceType.INTERNAL);
    }
    valueset.setUsername(username);
    valueset.setBindingIdentifier(elm.getName());
    valueset.setUrl(elm.getUrl());
    Valueset saved = valuesetService.save(valueset);
    ig.getValueSetRegistry().getCodesPresence().put(saved.getId(), elm.isIncludeChildren());
    savedIds.add(saved.getId());
  }



}
