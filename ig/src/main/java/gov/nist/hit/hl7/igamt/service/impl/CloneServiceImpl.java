/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileDependencyService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.RegistryUpdateReturn;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.CloneService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentDependencyService;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;
import gov.nist.hit.hl7.resource.change.service.ApplyClone;
import   gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintDependencyService;
/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class CloneServiceImpl implements  CloneService {

  @Autowired
  IgRepository igRepository;

  @Autowired
  MongoTemplate mongoTemplate;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ConfigService configService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  ProfileComponentService profileComponentService;

  @Autowired
  CompositeProfileStructureService compositeProfileServie;

  @Autowired
  ConformanceStatementRepository conformanceStatementRepository;

  @Autowired
  ConformanceProfileCompositeService compose;

  @Autowired
  PredicateRepository predicateRepository;

  @Autowired
  ValuesetService valueSetService;

  @Autowired
  RelationShipService relationshipService;

  @Autowired
  CoConstraintService coConstraintService;
  @Autowired
  FhirHandlerService fhirHandlerService;
  @Autowired
  SlicingService slicingService;
  @Autowired
  CommonService commonService;

  @Autowired
  CompositeProfileStructureService compositeProfileService;
  
  @Autowired
  BindingService bindingService;
  
  @Autowired
  ApplyClone applyClone;
  
  @Autowired
  IgService igService;
  
  @Autowired
  ConformanceProfileDependencyService conformanceProfileDependencyService;
  @Autowired
  SegmentDependencyService segmentDependencyService; 
  @Autowired
  MessageStructureRepository messageStructureRepository;
  @Autowired
  ResourceManagementService resourceManagementService;
  @Autowired
  DatatypeDependencyService datatypeDependencyService;
  
  @Autowired
  ProfileComponentDependencyService profileComponentDependencyService;
  @Autowired
  CompositeProfileDependencyService compositeProfilDependencyService;
  @Autowired
  CoConstraintDependencyService CoConstraintDependencyService;
  
  

  @Override
  public Ig clone(Ig ig, String username, CopyInfo copyInfo) throws EntityNotFound {

    updateIGAttributes(ig, username, copyInfo);
    HashMap<RealKey, String> newKeys = generateNewIds(ig); 
    DocumentInfo documentInfo = new DocumentInfo(this.generateAbstractDomainId(), DocumentType.IGDOCUMENT);
    RegistryUpdateReturn<Datatype> datatypeClones = cloneRegistry(ig.getDatatypeRegistry(), username, newKeys, documentInfo, Type.DATATYPE, copyInfo.getMode());
    RegistryUpdateReturn<Segment> segmentClones = cloneRegistry(ig.getSegmentRegistry(), username, newKeys, documentInfo, Type.SEGMENT, copyInfo.getMode());
    RegistryUpdateReturn<ConformanceProfile> conformanceProfileClones = cloneRegistry(ig.getConformanceProfileRegistry(), username, newKeys, documentInfo, Type.CONFORMANCEPROFILE, copyInfo.getMode());

    RegistryUpdateReturn<ProfileComponent> profileComponentClones = cloneRegistry(ig.getProfileComponentRegistry(), username, newKeys, documentInfo, Type.PROFILECOMPONENT, copyInfo.getMode());

    RegistryUpdateReturn<CompositeProfileStructure> compositeProfileStructureClones = cloneRegistry(ig.getCompositeProfileRegistry(), username, newKeys, documentInfo, Type.COMPOSITEPROFILE, copyInfo.getMode());

    RegistryUpdateReturn<Valueset> valueSetClones = cloneRegistry(ig.getValueSetRegistry(), username, newKeys, documentInfo, Type.VALUESET, copyInfo.getMode());

    RegistryUpdateReturn<CoConstraintGroup> coConstraintGroupClones = cloneRegistry(ig.getCoConstraintGroupRegistry(), username, newKeys, documentInfo, Type.COCONSTRAINTGROUP, copyInfo.getMode());


    try {

      if(datatypeClones.getSavedResources() != null && !datatypeClones.getSavedResources().isEmpty() ) {
        this.datatypeService.saveAll(datatypeClones.getSavedResources());
        ig.getDatatypeRegistry().setChildren(datatypeClones.getLinks());
      }
      if(segmentClones.getSavedResources() != null && !segmentClones.getSavedResources().isEmpty()) {
        this.segmentService.saveAll(segmentClones.getSavedResources());
        ig.getSegmentRegistry().setChildren(segmentClones.getLinks());
      }
      if(conformanceProfileClones.getSavedResources() != null && !conformanceProfileClones.getSavedResources().isEmpty()) {
        this.conformanceProfileService.saveAll(conformanceProfileClones.getSavedResources());
        ig.getConformanceProfileRegistry().setChildren(conformanceProfileClones.getLinks());
      }
      if(profileComponentClones.getSavedResources() != null && !profileComponentClones.getSavedResources().isEmpty()) {

        this.profileComponentService.saveAll(profileComponentClones.getSavedResources());
        ig.getProfileComponentRegistry().setChildren(profileComponentClones.getLinks());
      }
      if(compositeProfileStructureClones.getSavedResources() != null && !compositeProfileStructureClones.getSavedResources().isEmpty()) {

        this.compositeProfileService.saveAll(compositeProfileStructureClones.getSavedResources());
        ig.getCompositeProfileRegistry().setChildren(compositeProfileStructureClones.getLinks());
      }
      if(valueSetClones.getSavedResources() != null && !valueSetClones.getSavedResources().isEmpty()) { 
        this.valueSetService.saveAll(valueSetClones.getSavedResources());
        ig.getValueSetRegistry().setChildren(valueSetClones.getLinks());
      }
      if(coConstraintGroupClones.getSavedResources() != null && !coConstraintGroupClones.getSavedResources().isEmpty()) { 
        this.coConstraintService.saveAll(coConstraintGroupClones.getSavedResources());
        ig.getCoConstraintGroupRegistry().setChildren(coConstraintGroupClones.getLinks());
      }

      ig.setId(documentInfo.getDocumentId());
      Ig ret  = this.igRepository.save(ig);

      return ret;
    } catch(Exception e) {
      igService.removeChildren(documentInfo.getDocumentId());
      this.igRepository.deleteById(documentInfo.getDocumentId());
      throw e;
    }
  }

  private String generateAbstractDomainId() {
    return new ObjectId().toString();
  }




  public Ig updateIGAttributes(Ig ig, String username, CopyInfo info) {
    applyClone.updateAbstractDomainAttributes(ig, this.generateAbstractDomainId(), username);
    ig.setDomainInfo(ig.getDomainInfo());
    ig.getDomainInfo().setScope(Scope.USER);
    ig.setStatus(null);
    if(info.getMode().equals(CloneMode.CLONE)) {
      ig.getMetadata().setTitle(ig.getMetadata().getTitle() + "[clone]");
      ig.setContent(ig.getContent());

    } else if(info.getMode().equals(CloneMode.DERIVE)) {
      ig.getMetadata().setTitle(ig.getMetadata().getTitle() + "[derived]");
      ig.setDerived(true); 
      if(!info.isInherit()) {

        Set<TextSection> content = new HashSet<TextSection>();
        if(info.getTemplate() !=null && info.getTemplate().getChildren() !=null) {
          for (SectionTemplate template : info.getTemplate().getChildren()) {
            content.add(createSectionContent(template));
          }
          ig.setContent(content);
        }
      }
    }
    return ig;
  }


  private HashMap<RealKey, String> generateNewIds(Ig ig) {
    HashMap<RealKey, String> newKeys= new HashMap<RealKey, String>();
    addKeys(ig.getConformanceProfileRegistry(), Type.CONFORMANCEPROFILE, newKeys);
    addKeys(ig.getValueSetRegistry(), Type.VALUESET, newKeys);
    addKeys(ig.getDatatypeRegistry(), Type.DATATYPE, newKeys);
    addKeys(ig.getSegmentRegistry(), Type.SEGMENT, newKeys);
    addKeys(ig.getCoConstraintGroupRegistry(), Type.COCONSTRAINTGROUP, newKeys);
    addKeys(ig.getProfileComponentRegistry(), Type.PROFILECOMPONENT, newKeys);
    addKeys(ig.getCompositeProfileRegistry(), Type.COMPOSITEPROFILEREGISTRY, newKeys);
    return newKeys;

  }

  @SuppressWarnings("unchecked")
  public <T extends Resource> RegistryUpdateReturn<T> cloneRegistry(Registry reg, String username, HashMap<RealKey, String> newKeys, DocumentInfo documentInfo, Type resourceType, CloneMode cloneMode) throws EntityNotFound {
    RegistryUpdateReturn<T> ret = new RegistryUpdateReturn<T>();
    Set<Link> links  = new HashSet<Link>();
    ret.setSavedResources(new HashSet<T>());
    if(reg.getChildren() != null) {
      for(Link l: reg.getChildren()) {
        if(this.shouldClone(l)) {
          Resource res = getResourceByType(l.getId(), username, documentInfo, resourceType);
          RealKey rel = new RealKey(l.getId(), resourceType);
          applyCloneResource(res, newKeys.get(rel), username, documentInfo, cloneMode); // resource with new Id
          updateDependencies(res, newKeys); // resource with updated dependencies     
          l.setId(newKeys.get(rel));
          ret.getSavedResources().add((T)res);
        }
        links.add(l);
      }
    }
    ret.setLinks(links);
    return ret;

  }

  /**
   * @param res
   * @param newKeys
   */
  private void updateDependencies(Resource resource, HashMap<RealKey, String> newKeys) {

    if(resource instanceof ConformanceProfile) {
      this.conformanceProfileDependencyService.updateDependencies((ConformanceProfile) resource, newKeys);
    } 
    if(resource instanceof Segment) {
      this.segmentDependencyService.updateDependencies((Segment)resource, newKeys);
    } 
    if(resource instanceof Datatype) {
      this.datatypeDependencyService.updateDependencies((Datatype)resource, newKeys);

    } 
    if(resource instanceof ProfileComponent) {
      this.profileComponentDependencyService.updateDependencies((ProfileComponent)resource, newKeys);

    } 
    if(resource instanceof CompositeProfileStructure) {
      this.compositeProfilDependencyService.updateDependencies((CompositeProfileStructure)resource, newKeys);
    } 
    if(resource instanceof CoConstraintGroup) {
      this.coConstraintService.updateDependencies((CoConstraintGroup)resource, newKeys);
    } 
  }

  private void applyCloneResource(Resource resource, String newId, String username, DocumentInfo info , CloneMode mode ) {
    this.applyClone.updateResourceAttributes(resource, newId, username, info);
    if(resource instanceof CoConstraintGroup) {
      applyCoConstraintCloneTag((CoConstraintGroup) resource);
    } else if(resource instanceof ConformanceProfile) {
      applyCoConstraintCloneTag((ConformanceProfile) resource);
    }

    if(mode.equals(CloneMode.DERIVE)) {
      this.lockConformanceStatements(resource);
    }       

  }

  /**
   * @param resource
   */
  private void lockConformanceStatements(Resource resource) {
    if(resource instanceof ConformanceProfile) {
      ConformanceProfile profile = (ConformanceProfile)resource;
      this.bindingService.lockConformanceStatements(profile.getBinding());
    }
    if(resource instanceof Segment) {
      Segment segment = (Segment)resource;
      this.bindingService.lockConformanceStatements(segment.getBinding());
    }  
    if(resource instanceof Datatype) {
      Datatype datatype = (Datatype)resource;
      this.bindingService.lockConformanceStatements(datatype.getBinding());
    }  

  }

  /**
   * @param resource
   */
  private void applyCoConstraintCloneTag(ConformanceProfile elm) {
    if (elm.getCoConstraintsBindings() != null) {
      for (CoConstraintBinding binding : elm.getCoConstraintsBindings()) {
        if (binding.getBindings() != null) {
          for (CoConstraintBindingSegment segBinding : binding.getBindings()) {
            if (segBinding.getTables() != null) {
              for (CoConstraintTableConditionalBinding ccBinding : segBinding.getTables()) {
                if (ccBinding.getValue() != null) {
                  this.coConstraintService.updateCloneTag(ccBinding.getValue(), true);
                }
              }
            }
          }
        }
      }
    }

  }

  /**
   * @param resource
   */
  private void applyCoConstraintCloneTag(CoConstraintGroup resource) {
    if(resource.getCoConstraints() !=null) {
      for(CoConstraint cc: resource.getCoConstraints() ) {
        cc.setCloned(true);
      }
    }
  }



  private boolean shouldClone(Link link) {
    return link.isUser();
  }

  private TextSection createSectionContent(SectionTemplate template) {
    TextSection section = new TextSection();
    section.setId(new ObjectId().toString());
    section.setType(Type.fromString(template.getType()));
    section.setDescription("");
    section.setLabel(template.getLabel());
    section.setPosition(template.getPosition());

    if (template.getChildren() != null) {
      Set<TextSection> children = new HashSet<TextSection>();
      for (SectionTemplate child : template.getChildren()) {
        children.add(createSectionContent(child));
      }
      section.setChildren(children);
    }
    return section;
  }

  public  Resource getResourceByType( String id, String username, DocumentInfo parent, Type type ) throws EntityNotFound {

    switch(type) {
      case CONFORMANCEPROFILE:
        return conformanceProfileService.findById(id);
      case PROFILECOMPONENT:
        return profileComponentService.findById(id);
      case COMPOSITEPROFILE:
        return compositeProfileService.findById(id);
      case SEGMENT:
        return segmentService.findById(id);
      case DATATYPE:
        return datatypeService.findById(id);
      case COCONSTRAINTGROUP:
        return coConstraintService.findById(id);
      case VALUESET:
        return valueSetService.findById(id);
      default:
        break;
    }
    return null;
  }

  private void addKeys(Registry reg, Type type, HashMap<RealKey, String> map) {
    if (reg != null && reg.getChildren() != null) {
      for (Link l : reg.getChildren()) {
        if (l.getDomainInfo().getScope().equals(Scope.USER)) {
          String newId = new ObjectId().toString();
          map.put(new RealKey(l.getId(), type), newId);
        } else {
          map.put(new RealKey(l.getId(), type), l.getId());
        }
      }
    }
  }



}
