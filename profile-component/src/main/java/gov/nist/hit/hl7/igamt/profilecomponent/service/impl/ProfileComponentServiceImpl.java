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
package gov.nist.hit.hl7.igamt.profilecomponent.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageProfileIdentifier;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentContextNotFoundException;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentNotFoundException;
import gov.nist.hit.hl7.igamt.profilecomponent.repository.ProfileComponentRepository;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;
import gov.nist.hit.hl7.resource.change.service.ApplyChange;


/**
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
@Service("profileComponentService")
public class ProfileComponentServiceImpl implements ProfileComponentService {

  @Autowired
  private ProfileComponentRepository profileComponentRepository;

  @Autowired
  private ConformanceProfileService conformanceProfileService;

  @Autowired
  private SegmentService segmentService;
  @Autowired
  private DatatypeService datatypeService;
  @Autowired
  private ValuesetService valuesetService;
  @Autowired
  BindingService bindingService; 

  @Autowired
  EntityChangeService entityChangeService;

  @Autowired 
  CommonService commonService;

  @Autowired
  ApplyChange applyChange;
  
  @Autowired
  CoConstraintService coConstraintService;


  @Override
  public ProfileComponent findById(String id) {
    return profileComponentRepository.findById(id).orElse(null);
  }

  @Override
  public ProfileComponent create(ProfileComponent profileComponent) {
    profileComponent.setId(new String());
    profileComponent = profileComponentRepository.save(profileComponent);
    return profileComponent;
  }

  @Override
  public List<ProfileComponent> findAll() {
    return profileComponentRepository.findAll();
  }

  @Override
  public ProfileComponent save(ProfileComponent profileComponent) {
    // profileComponent.setId(StringUtil.updateVersion(profileComponent.getId()));
    profileComponent = profileComponentRepository.save(profileComponent);
    return profileComponent;
  }

  @Override
  public List<ProfileComponent> saveAll(List<ProfileComponent> profileComponents) {
    ArrayList<ProfileComponent> savedProfileComponents = new ArrayList<>();
    for (ProfileComponent profileComponent : profileComponents) {
      savedProfileComponents.add(this.save(profileComponent));
    }
    return savedProfileComponents;
  }

  @Override
  public void delete(String id) {
    profileComponentRepository.deleteById(id);
  }

  @Override
  public void removeCollection() {
    profileComponentRepository.deleteAll();
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#findByIdIn(java.util.Set)
   */
  @Override
  public List<ProfileComponent> findByIdIn(Set<String> ids) {
    // TODO Auto-generated method stub
    return profileComponentRepository.findByIdIn(ids);
  }

  @Override 
  public ProfileComponent addChildrenFromDisplayElement(String id, List<DisplayElement> children) {

    ProfileComponent pc = this.findById(id);
    if(pc.getChildren() == null) {
      pc.setChildren(new HashSet<ProfileComponentContext>());
    }

    for(int i=0; i < children.size(); i++) {
      DisplayElement elm = children.get(i);
      // TODO set struct ID 
      ProfileComponentContext ctx = new ProfileComponentContext(elm.getId(), elm.getType(), elm.getId(), elm.getFixedName(), i+ pc.getChildren().size()+1, new HashSet<ProfileComponentItem>(), new ProfileComponentBinding());
      pc.getChildren().add(ctx);
    }
    this.save(pc);
    return pc;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#findContextById(java.lang.String, java.lang.String)
   */
  @Override
  public ProfileComponentContext findContextById(String pcId, String contextId) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException {
    ProfileComponent pc = this.findById(pcId);
    if(pc  == null ) {
      throw new ProfileComponentNotFoundException(pcId);
    }
    return pc.getChildren().stream().filter(customer -> contextId.equals(customer.getId())).findAny().orElseThrow( () -> new ProfileComponentContextNotFoundException(contextId));


  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#getDependencies(java.lang.String, java.lang.String)
   */
  @Override
  public Set<Resource> getDependencies(String pcId, String contextId) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException {
    // TODO Auto-generated method stub
    Set<Resource> ret = new HashSet<Resource>();
    ProfileComponentContext profileComponentContext = this.findContextById(pcId, contextId);
    if(profileComponentContext != null) {
      if(profileComponentContext.getLevel().equals(Type.CONFORMANCEPROFILE)) {
        ConformanceProfile cp = this.conformanceProfileService.findById(profileComponentContext.getSourceId());
        ret.addAll(this.conformanceProfileService.getDependencies(cp));
      }else if(profileComponentContext.getLevel().equals(Type.SEGMENT)) {
        Segment s = this.segmentService.findById(profileComponentContext.getSourceId());
        if(s != null) {
          ret.addAll(this.segmentService.getDependencies(s));
        }
      }
      if(profileComponentContext.getProfileComponentItems() !=null) {
        for(ProfileComponentItem item: profileComponentContext.getProfileComponentItems()) {
          for(ItemProperty prop : item.getItemProperties()) {
            if(prop instanceof PropertyDatatype) {
              PropertyDatatype dt = (PropertyDatatype)prop;
              Datatype d = this.datatypeService.findById(dt.getDatatypeId());
              if(d != null) {
                ret.addAll(this.datatypeService.getDependencies(d));
              }
            }
            if(prop instanceof PropertyRef) {
              PropertyRef ref = (PropertyRef)prop;
              Segment segment = this.segmentService.findById(ref.getRef());
              if(segment != null) {
                ret.addAll(this.segmentService.getDependencies(segment));
              }
            } 
          }
        }
      }
    }

    return ret;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#updateContext(java.lang.String, java.lang.String, gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext)
   */
  @Override
  public ProfileComponentContext updateContext(String pcId, String contextId, ProfileComponentContext updated) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException {
    ProfileComponent pc = this.findById(pcId);
    for(ProfileComponentContext ctx:  pc.getChildren()) {
      if(ctx.getId().equals(contextId)) {
        updateDynamicMapping(ctx, updated);  
        ctx.setProfileComponentItems(updated.getProfileComponentItems());
        ctx.setProfileComponentBindings(updated.getProfileComponentBindings());
        break;
      }
    }
    this.save(pc);
    return findContextById(pcId, contextId);

  }

  void updateDynamicMapping(ProfileComponentContext oldContext, ProfileComponentContext newContext){
    if(oldContext.getLevel().equals(Type.SEGMENT)) {
      Segment s = this.segmentService.findById(oldContext.getSourceId());
      if(s != null && s.getName().equals("OBX")) {
        if (this.hasObx2Change(newContext.getProfileComponentBindings())) {
          checkAndUpdateDynamicMapping(oldContext, newContext, s);
        } else if(oldContext.getProfileComponentDynamicMapping() != null && oldContext.getProfileComponentDynamicMapping().isOverride()){
          oldContext.setProfileComponentDynamicMapping(null);
        } else {
          oldContext.setProfileComponentDynamicMapping(newContext.getProfileComponentDynamicMapping());
        }
      }
    }  
  }


  /**
   * @param profileComponentBindings
   * @return
   */
  private boolean hasObx2Change(ProfileComponentBinding profileComponentBindings) {
    if(profileComponentBindings == null || profileComponentBindings.getContextBindings() == null) {
      return false;
    }else {
      Set<PropertyBinding> obx2Bindings = profileComponentBindings.getContextBindings().stream().filter((x) -> x.getTarget().equals("2")).collect(Collectors.toSet());
      return obx2Bindings != null && !obx2Bindings.isEmpty();
    }
  }

  private void checkAndUpdateDynamicMapping(ProfileComponentContext ctx,
      ProfileComponentContext updated, Segment s) {
    String oldVs = this.getObx2ValueSet(ctx, s);
    String newVs = this.getObx2ValueSet(updated, s);
    if(newVs != oldVs) {
      ctx.setProfileComponentDynamicMapping(this.restoreDyanamicMapping(newVs));
    }else {
      ctx.setProfileComponentDynamicMapping(updated.getProfileComponentDynamicMapping());
    }
  }


  /**
   * @param newVs
   * @return
   */
  private PropertyDynamicMapping restoreDyanamicMapping(String newVs) {
    PropertyDynamicMapping mapping = new PropertyDynamicMapping();
    mapping.setOverride(true);
    mapping.setItems(new HashSet<PcDynamicMappingItem>());
    if (newVs !=null) {
      Valueset source = valuesetService.findById(newVs);
      if(source !=null) {
        for(Code c : source.getCodes()) {
          if(c.getValue() !=null && c.getUsage() != CodeUsage.E) {
            Datatype d = datatypeService.findOneByNameAndVersionAndScope(c.getValue(), source.getDomainInfo().getVersion(), Scope.HL7STANDARD.toString());
            if(d != null) {
              mapping.getItems().add((new PcDynamicMappingItem(ChangeType.ADD, d.getName(), d.getId())));
            }
          }
        }
      }
    }
    return mapping;
  }

  private String getObx2ValueSet(ProfileComponentContext ctx, Segment s) {
    Set<PropertyBinding> obx2Bindings = new HashSet<PropertyBinding>();
    if(ctx.getProfileComponentBindings() != null && ctx.getProfileComponentBindings().getContextBindings() !=null) {
      obx2Bindings = ctx.getProfileComponentBindings().getContextBindings().stream().filter((x) -> x.getTarget() != null && x.getTarget().equals("2")).collect(Collectors.toSet());
      if(obx2Bindings == null || obx2Bindings.isEmpty()) {
        return this.segmentService.findObx2VsId(s);
      }else { 
        return findObx2ValueSet(obx2Bindings);
      }
    }else return null;
  }

  /**
   * @param obx2Bindings
   * @return 
   */
  private String findObx2ValueSet(Set<PropertyBinding> obx2Bindings) {

    for(PropertyBinding prop: obx2Bindings) {
      if(prop instanceof PropertyValueSet ) {
        PropertyValueSet propvs = (PropertyValueSet)prop;
        if(propvs.getValuesetBindings() != null) {
          Optional<ValuesetBinding> vs = propvs.getValuesetBindings().stream().findAny();
          if(vs.isPresent() && vs.get().getValueSets() !=null && !vs.get().getValueSets().isEmpty()) {
            return vs.get().getValueSets().get(0);
          }
        }
      }
    }
    return null;
  }

  @Override
  public List<PropertyConformanceStatement> updateContextConformanceStatements(String pcId, String contextId, List<PropertyConformanceStatement> conformanceStatements) throws ProfileComponentContextNotFoundException {
    boolean found = false;
    ProfileComponent pc = this.findById(pcId);
    for(ProfileComponentContext ctx:  pc.getChildren()) {
      if(ctx.getId().equals(contextId)) {
        ProfileComponentBinding ctxBinding = ctx.getProfileComponentBindings();
        if(ctxBinding == null) {
          ctxBinding = new ProfileComponentBinding();
        }
        Set<PropertyBinding> rootBinding = ctxBinding.getContextBindings();
        if(rootBinding == null) {
          rootBinding = new HashSet<>();
        }

        rootBinding = rootBinding
            .stream()
            .filter((elm) -> !elm.getPropertyKey().equals(PropertyType.STATEMENT))
            .collect(Collectors.toSet());
        rootBinding.addAll(conformanceStatements);
        ctxBinding.setContextBindings(rootBinding);
        ctx.setProfileComponentBindings(ctxBinding);
        this.save(pc);
        return conformanceStatements;
      }
    }
    throw new ProfileComponentContextNotFoundException(contextId);
  }

  @Override
  public ProfileComponentContext updateContextCoConstraintBindings(String pcId, String contextId, PropertyCoConstraintBindings coConstraintBindings) throws Exception {
    ProfileComponent pc = this.findById(pcId);
    for(ProfileComponentContext ctx:  pc.getChildren()) {
      if(ctx.getId().equals(contextId)) {
        if(ctx.getLevel().equals(Type.CONFORMANCEPROFILE)) {
          ctx.setProfileComponentCoConstraints(coConstraintBindings);
          this.save(pc);
          return ctx;
        } else {
          throw new Exception("Profile component context is not on a Conformance Profile");
        }
      }
    }
    throw new ProfileComponentContextNotFoundException(contextId);
  }


  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#deleteContextById(java.lang.String, java.lang.String)
   */
  @Override
  public ProfileComponent deleteContextById(String pcId, String contextId) throws ProfileComponentNotFoundException {

    ProfileComponent pc = this.findById(pcId);
    if(pc  == null ) {
      throw new ProfileComponentNotFoundException(pcId);
    }
    pc.getChildren().removeIf((x) -> x.getId().equals(contextId));
    return pc;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#applyChanges(gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent, java.util.List, java.lang.String)
   */
  @Override
  public void applyChanges(ProfileComponent pc, List<ChangeItemDomain> cItems) throws ApplyChangeException {

    Map<PropertyType,ChangeItemDomain> singlePropertyMap = applyChange.convertToSingleChangeMap(cItems);
    this.applyMetaData(pc, singlePropertyMap);
    this.save(pc);
  }

  private void applyMetaData( ProfileComponent cp, Map<PropertyType, ChangeItemDomain> singlePropertyMap) throws ApplyChangeException{

    applyChange.applyResourceChanges(cp, singlePropertyMap);
    ObjectMapper mapper = new ObjectMapper();

    if (singlePropertyMap.containsKey(PropertyType.NAME)) {
      singlePropertyMap.get(PropertyType.NAME).setOldPropertyValue(cp.getName());
      cp.setName((String) singlePropertyMap.get(PropertyType.NAME).getPropertyValue());
    }
    if (singlePropertyMap.containsKey(PropertyType.PROFILEIDENTIFIER)) {
      try {
        String jsonInString = mapper.writeValueAsString(singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER).getPropertyValue());
        singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER).setOldPropertyValue(cp.getPreCoordinatedMessageIdentifier());
        MessageProfileIdentifier profileIdentifier= mapper.readValue(jsonInString, MessageProfileIdentifier.class);
        cp.setPreCoordinatedMessageIdentifier(profileIdentifier);
      } catch (IOException e) {
        throw new ApplyChangeException(singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER));
      }
    } 

  }

  @Override
  public PropertyDynamicMapping updateContextDynamicMapping(ProfileComponent pc, String contextId,
      PropertyDynamicMapping pcDynamicMapping) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException {
    for(ProfileComponentContext ctx:  pc.getChildren()) {
      if(ctx.getId().equals(contextId)) {
        ctx.setProfileComponentDynamicMapping(pcDynamicMapping);
        break;
      }
    }
    this.save(pc);
    return findContextById(pc.getId(), contextId).getProfileComponentDynamicMapping();

  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#saveAll(java.util.Set)
   */
  @Override
  public List<ProfileComponent> saveAll(Set<ProfileComponent> profileComponents) {
    // TODO Auto-generated method stub
    return this.profileComponentRepository.saveAll(profileComponents);
  }



}
