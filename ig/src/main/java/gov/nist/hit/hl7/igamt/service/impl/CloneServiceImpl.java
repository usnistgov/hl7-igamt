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

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupRegistry;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.ActiveInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.CopyRegistryReturn;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.CloneService;
import gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;
import gov.nist.hit.hl7.resource.change.service.ApplyClone;

/**
 * @author Abdelghani El Ouakili
 *
 */
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
  InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;
  @Autowired
  BindingService bindingService;
  @Autowired
  ApplyClone applyClone;

  public Ig clone(Ig ig, String username, CopyInfo info) {

    updateIGAttributes(ig, username, info);
    HashMap<RealKey, String> newKeys = generateNewIds(ig);
    
    
    
    
    newIg.setValueSetRegistry(copyValueSetRegistry(ig.getValueSetRegistry(), newKeys, username, info.getMode()));
    newIg.setDatatypeRegistry(copyDatatypeRegistry(ig.getDatatypeRegistry(), newKeys, username, info.getMode()));
    newIg.setSegmentRegistry(copySegmentRegistry(ig.getSegmentRegistry(),newKeys, username,info.getMode()));
    newIg.setConformanceProfileRegistry(copyConformanceProfileRegistry(ig.getConformanceProfileRegistry(), newKeys, username, info.getMode()));
    newIg.setCoConstraintGroupRegistry(
        copyCoConstraintGRoupRegistry(ig.getCoConstraintGroupRegistry(), newKeys, username, newIg.getId(), info.getMode())
        );
    newIg.setProfileComponentRegistry(copyProfileComponentRegistry(ig.getProfileComponentRegistry(), newKeys, username, info.getMode()));
    newIg.setCompositeProfileRegistry(copyCompositeProfileRegistry(ig.getCompositeProfileRegistry(), newKeys, username, info.getMode()));
    newIg.getDomainInfo().setScope(Scope.USER);
    newIg.setCreationDate(new Date());

    newIg = this.save(newIg);
    return newIg;
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
  
  
 
  


   private HashMap<RealKey, String> generateNewIds(Ig ig){
    HashMap<RealKey, String> newKeys= new HashMap<RealKey, String>();
    newKeys.put(new RealKey(ig.getId(),Type.IGDOCUMENT), ig.getId());
    addKeys(ig.getConformanceProfileRegistry(), Type.CONFORMANCEPROFILE, newKeys);
    addKeys(ig.getValueSetRegistry(), Type.VALUESET, newKeys);
    addKeys(ig.getDatatypeRegistry(), Type.DATATYPE, newKeys);
    addKeys(ig.getSegmentRegistry(), Type.SEGMENT, newKeys);
    addKeys(ig.getCoConstraintGroupRegistry(), Type.COCONSTRAINTGROUP, newKeys);
    addKeys(ig.getProfileComponentRegistry(), Type.PROFILECOMPONENT, newKeys);
    addKeys(ig.getCompositeProfileRegistry(), Type.COMPOSITEPROFILEREGISTRY, newKeys);
    return newKeys;
    
  }
   
   
   public <T extends Resource> CopyRegistryReturn<T> cloneRegistry(Registry reg) {
     
     
    return null;
     
   }
   
   private boolean shouldClone(Link link) {
     return link.isUser();
   }


  private TextSection createSectionContent(SectionTemplate template) {
    // TODO Auto-generated method stub
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

  @Override
  public Link cloneConformanceProfile(String key, HashMap<RealKey, String> newKeys, Link l,
      String username, Scope scope, CloneMode cloneMode) {
    return null;
  }


  @Override
  public Link cloneProfileComponent(String newId, HashMap<RealKey, String> newKeys, Link l,
      String username, Scope scope, CloneMode cloneMode) {
    return null;
  }


  @Override
  public Link cloneSegment(String key, HashMap<RealKey, String> newKeys, Link l, String username,
      Scope scope, CloneMode cloneMode) {
    return null;
  }

  @Override
  public Link cloneDatatype(String newId, HashMap<RealKey, String> newKey, Link l, String username,
      Scope scope, CloneMode cloneMode) {
    return null;
  }


  @Override
  public Link cloneValueSet(String newkey, Link l, String username, Scope scope,
      CloneMode cloneMode) {
    return null;
  }
  public Link cloneCoConstraintGroup(String newkey, Link l, String username, Scope scope,
      CloneMode cloneMode) {
    return null;
  }




  public Resource getResourceByType( String id, String username, DocumentInfo parent, Type type ) throws CoConstraintGroupNotFoundException {


    switch(type) {
      case CONFORMANCEPROFILE:
        return conformanceProfileService.findById(id).clone();
      case PROFILECOMPONENT:
        return profileComponentService.findById(id).clone();
      case COMPOSITEPROFILE:
        return compositeProfileService.findById(id).clone();
      case SEGMENT:
        return segmentService.findById(id).clone();
      case DATATYPE:
        return datatypeService.findById(id).clone();
      case COCONSTRAINTGROUP:
        return coConstraintService.findById(id).clone(); 
      case VALUESET:
        return valueSetService.findById(id).clone();
      default:
        break;
    }
    return null;

  }








  private CoConstraintGroupRegistry copyCoConstraintGRoupRegistry(
      CoConstraintGroupRegistry coConstraintGroupRegistry, HashMap<RealKey, String> newKeys,
      String username, String documentTarget, CloneMode cloneMode) {
    CoConstraintGroupRegistry newReg = new CoConstraintGroupRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : coConstraintGroupRegistry.getChildren()) {
      RealKey key  = new RealKey(l.getId(), Type.COCONSTRAINTGROUP);
      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(coConstraintService.clone(
            newKeys.get(key),newKeys,l, username, Scope.USER, documentTarget, cloneMode));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private ConformanceProfileRegistry copyConformanceProfileRegistry(
      ConformanceProfileRegistry conformanceProfileRegistry,
      HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {

    ConformanceProfileRegistry newReg = new ConformanceProfileRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : conformanceProfileRegistry.getChildren()) {
      RealKey key  = new RealKey(l.getId(), Type.CONFORMANCEPROFILE);
      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(conformanceProfileService.cloneConformanceProfile(
            newKeys.get(key),newKeys,l, username, Scope.USER, cloneMode));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private SegmentRegistry copySegmentRegistry(SegmentRegistry segmentRegistry,
      HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {
    // TODO Auto-generated method stub
    SegmentRegistry newReg = new SegmentRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : segmentRegistry.getChildren()) {
      RealKey key = new RealKey(l.getId(), Type.SEGMENT);
      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(segmentService.cloneSegment(newKeys.get(key),newKeys, l, username,Scope.USER, cloneMode));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private DatatypeRegistry copyDatatypeRegistry(DatatypeRegistry datatypeRegistry,
      HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {
    // TODO Auto-generated method stub
    DatatypeRegistry newReg = new DatatypeRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : datatypeRegistry.getChildren()) {
      RealKey key = new RealKey(l.getId(), Type.DATATYPE);

      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(this.datatypeService.cloneDatatype(newKeys.get(key),newKeys, l, username, Scope.USER, cloneMode));
      }
    }

    newReg.setChildren(children);
    return newReg;
  }

  private ProfileComponentRegistry copyProfileComponentRegistry(ProfileComponentRegistry profileComponentRegistry,
      HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {
    // TODO Auto-generated method stub
    ProfileComponentRegistry newReg = new ProfileComponentRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : profileComponentRegistry.getChildren()) {
      RealKey key = new RealKey(l.getId(), Type.PROFILECOMPONENT);

      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(this.profileComponentService.cloneProfileComponent(newKeys.get(key),newKeys, l, username, Scope.USER, cloneMode));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }


  private CompositeProfileRegistry copyCompositeProfileRegistry(CompositeProfileRegistry compositeProfileRegistry,
      HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {
    // TODO Auto-generated method stub
    CompositeProfileRegistry newReg = new CompositeProfileRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : compositeProfileRegistry.getChildren()) {
      RealKey key = new RealKey(l.getId(), Type.COMPOSITEPROFILEREGISTRY);

      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(this.compositeProfileServie.cloneCompositeProfile(newKeys.get(key),newKeys, l, username, Scope.USER, cloneMode));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private ValueSetRegistry copyValueSetRegistry(ValueSetRegistry reg,
      HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {
    // TODO Auto-generated method stub
    ValueSetRegistry newReg = new ValueSetRegistry();
    newReg.setExportConfig(reg.getExportConfig());
    newReg.setCodesPresence(reg.getCodesPresence());
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : reg.getChildren()) {
      RealKey key = new RealKey(l.getId(), Type.VALUESET);
      if (!l.isUser()) {
        children.add(l);
      } else {
        Link newLink = this.valueSetService.cloneValueSet(newKeys.get(key), l, username, Scope.USER, cloneMode);            
        children.add(newLink);
      }
    }
    newReg.setChildren(children);
    return newReg;
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
  /// Update dependencies 



}
