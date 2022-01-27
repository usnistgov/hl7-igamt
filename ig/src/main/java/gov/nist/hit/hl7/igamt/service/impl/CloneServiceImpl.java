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

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
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
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.RegistryUpdateReturn;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.CloneService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
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


  public Ig clone(Ig ig, String username, CopyInfo copyInfo) throws CoConstraintGroupNotFoundException {

    updateIGAttributes(ig, username, copyInfo);
    HashMap<RealKey, String> newKeys = generateNewIds(ig); 
    DocumentInfo documentInfo = new DocumentInfo(this.generateAbstractDomainId(), DocumentType.IGDOCUMENT);
    RegistryUpdateReturn<Datatype> datatypeClones = cloneRegistry(ig.getDatatypeRegistry(), username, newKeys, documentInfo, Type.DATATYPE, copyInfo.getMode());
    RegistryUpdateReturn<Segment> segmentClones = cloneRegistry(ig.getSegmentRegistry(), username, newKeys, documentInfo, Type.SEGMENT, copyInfo.getMode());
    RegistryUpdateReturn<ConformanceProfile> conformanceProfileClones = cloneRegistry(ig.getConformanceProfileRegistry(), username, newKeys, documentInfo, Type.CONFORMANCEPROFILE, copyInfo.getMode());

    RegistryUpdateReturn<ProfileComponent> profileComponentClones = cloneRegistry(ig.getProfileComponentRegistry(), username, newKeys, documentInfo, Type.PROFILECOMPONENTREGISTRY, copyInfo.getMode());

    RegistryUpdateReturn<CompositeProfileStructure> compositeProfileStructureClones = cloneRegistry(ig.getCompositeProfileRegistry(), username, newKeys, documentInfo, Type.COMPOSITEPROFILEREGISTRY, copyInfo.getMode());

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
      ig.setId(documentInfo.getId());
      Ig ret  = this.igRepository.save(ig);
      return ret;

    } catch(Exception e) {
     
    }
    return ig;


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


  public <T extends Resource> RegistryUpdateReturn<T> cloneRegistry(Registry reg, String username, HashMap<RealKey, String> newKeys, DocumentInfo documentInfo, Type resourceType, CloneMode cloneMode) throws CoConstraintGroupNotFoundException {
    RegistryUpdateReturn<T> ret = new RegistryUpdateReturn<T>();
    Registry newReg = new Registry();
    ret.setSavedResources(new HashSet<T>());
    for(Link l: reg.getChildren()) {
      if(!this.shouldClone(l)) {
        newReg.getChildren().add(l);
      }else {

        Resource res = getResourceByType(l.getId(), username, documentInfo, resourceType);
        RealKey rel = new RealKey(l.getId(), resourceType);
        applyCloneResource(res, newKeys.get(rel), username, documentInfo, cloneMode); // resource with new Id
        updateDependencies(res, newKeys); // resource with updated dependencies 
        newReg.getChildren().add(this.createLink(res, resourceType ));// registry with links up to date
        ret.getSavedResources().add((T)res);
      }
    }
    return null;

  }



  /**
   * @param res
   * @param newKeys
   */
  private void updateDependencies(Resource resource, HashMap<RealKey, String> newKeys) {

    if(resource instanceof ConformanceProfile) {
      this.conformanceProfileService.updateDependencies((ConformanceProfile) resource, newKeys);
    } 
    if(resource instanceof Segment) {
      this.segmentService.updateDependencies((Segment)resource, newKeys);
    } 
    if(resource instanceof Datatype) {
      this.datatypeService.updateDependencies((Datatype)resource, newKeys);

    } 
    if(resource instanceof ProfileComponent) {
      this.profileComponentService.updateDependencies((ProfileComponent)resource, newKeys);

    } 
    if(resource instanceof CompositeProfileStructure) {
      this.compositeProfileServie.updateDependencies((CompositeProfileStructure)resource, newKeys);
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

  }

  /**
   * @param resource
   */
  private void applyCoConstraintCloneTag(ConformanceProfile resource) {
    // TODO Auto-generated method stub

  }

  /**
   * @param resource
   */
  private void applyCoConstraintCloneTag(CoConstraintGroup resource) {
    // TODO Auto-generated method stub

  }

  /**
   * @param res
   * @param resourceType
   * @return
   */
  private <T extends Resource> Link createLink(T res, Type resourceType) {
    // TODO Auto-generated method stub
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


  public  Resource getResourceByType( String id, String username, DocumentInfo parent, Type type ) throws CoConstraintGroupNotFoundException {


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
