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
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.ProfileType;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Role;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageProfileIdentifier;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
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
    boolean found = false;
    ProfileComponent pc = this.findById(pcId);
    for(ProfileComponentContext ctx:  pc.getChildren()) {
      if(ctx.getId().equals(contextId)) {
        ctx.setProfileComponentItems(updated.getProfileComponentItems());
        ctx.setProfileComponentBindings(updated.getProfileComponentBindings());
        break;
      }
    }
    this.save(pc);

    return findContextById(pcId, contextId);

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

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#cloneProfileComponent(java.lang.String, java.util.HashMap, gov.nist.hit.hl7.igamt.common.base.domain.Link, java.lang.String, gov.nist.hit.hl7.igamt.common.base.domain.Scope, gov.nist.hit.hl7.igamt.common.base.util.CloneMode)
   */
  @Override
  public Link cloneProfileComponent(String newId, HashMap<RealKey, String> newKeys, Link l,
      String username, Scope scope, CloneMode cloneMode) {
    ProfileComponent old = this.findById(l.getId());
    ProfileComponent elm = old.clone();
    elm.setId(newId);
    elm.getDomainInfo().setScope(scope);
    elm.setUsername(username);
    elm.setOrigin(l.getId());
    elm.setDerived(cloneMode.equals(CloneMode.DERIVE));
    Link newLink = new Link(elm);
    updateDependencies(elm, newKeys, cloneMode);
    this.save(elm);
    return newLink;

  }

  private void updateDependencies(ProfileComponent elm, HashMap<RealKey, String> newKeys, CloneMode cloneMode) {

    for(ProfileComponentContext context: elm.getChildren()) {
      RealKey contextKey = new RealKey(context.getSourceId(), context.getLevel());
      if(newKeys.containsKey(contextKey)) {
        context.setSourceId(newKeys.get(contextKey));
      }
      for(ProfileComponentItem item: context.getProfileComponentItems()) {
        for(ItemProperty prop : item.getItemProperties()) {
          if(prop instanceof PropertyDatatype) {
            PropertyDatatype propDt =  (PropertyDatatype)prop;
            if(propDt.getDatatypeId() != null) {
              RealKey key = new RealKey(propDt.getDatatypeId(), Type.DATATYPE);
              if (newKeys.containsKey(key)) {
                propDt.setDatatypeId(newKeys.get(key));
              }
            }
          }
          if(prop instanceof PropertyRef) {
            PropertyRef propRef =  (PropertyRef)prop;
            if(propRef.getRef() != null) {
              RealKey key = new RealKey(propRef.getRef(), Type.SEGMENT);
              if (newKeys.containsKey(key)) {
                propRef.setRef(newKeys.get(key));
              }
            }
          }
          if(prop instanceof PropertyValueSet) {
            PropertyValueSet propVs =  (PropertyValueSet)prop;
            this.bindingService.processAndSubstitute(propVs.getValuesetBindings(), newKeys);          
          }
          if(prop instanceof PropertySingleCode) {
            PropertySingleCode propSingleCode = (PropertySingleCode)prop;
            //TODO update sig
          }
        }
      }
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#collectDependencies(gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent)
   */
  @Override
  public Set<RelationShip> collectDependencies(ProfileComponent pc) {
    Set<RelationShip> relations = new HashSet<RelationShip>();
    if(pc.getChildren() != null) {

      for(ProfileComponentContext ctx: pc.getChildren()) {
        String label = this.getResourceLabel(ctx);

        RelationShip rel = new RelationShip(new ReferenceIndentifier(ctx.getSourceId(), ctx.getLevel()),
            new ReferenceIndentifier(pc.getId(), Type.PROFILECOMPONENT),
            new ReferenceLocation(getContextType(ctx.getLevel()), label, label)); 
        relations.add(rel);
        if(ctx.getProfileComponentItems() != null) {
          relations.addAll(collectDependencies(ctx, pc.getName(), pc.getId(), label));
        }
      }
    }

    return relations;
  }


  /**
   * @param level
   * @return
   */
  private Type getContextType(Type level) {
    if(level.equals(Type.CONFORMANCEPROFILE)) {
      return Type.MESSAGECONTEXT;
    }else if (level.equals(Type.SEGMENT)){
      return Type.SEGMENTCONTEXT;
    }else return null;
  }

  private Set<RelationShip> collectDependencies(ProfileComponentContext ctx, String pcName, String pcId, String resourceName) {
    Set<RelationShip> relations = new HashSet<RelationShip>();

    for(ProfileComponentItem item: ctx.getProfileComponentItems()) {
      if(item.getItemProperties() != null) {
        for(ItemProperty prop : item.getItemProperties()) {
          if(prop instanceof PropertyDatatype) {
            PropertyDatatype propDt =  (PropertyDatatype)prop;
            if(propDt.getDatatypeId() != null) {
              RelationShip rel = new RelationShip(new ReferenceIndentifier(propDt.getDatatypeId(), Type.DATATYPE),
                  new ReferenceIndentifier(pcId, Type.PROFILECOMPONENT),
                  new ReferenceLocation(Type.PROFILECOMPONENTITEM,  resourceName , item.getPath().replaceAll("-", "."))); 
              relations.add(rel);

            }
          }
          if(prop instanceof PropertyRef) {
            PropertyRef propRef =  (PropertyRef)prop;
            if(propRef.getRef() != null) {
              RelationShip rel = new RelationShip(new ReferenceIndentifier(propRef.getRef(), Type.SEGMENT),
                  new ReferenceIndentifier(pcId, Type.PROFILECOMPONENT),
                  new ReferenceLocation(Type.PROFILECOMPONENTITEM, resourceName, item.getPath().replaceAll("-", "."))); 
              relations.add(rel);
            }
          }
          if(prop instanceof PropertyValueSet) {
            PropertyValueSet propVs =  (PropertyValueSet)prop;
            if(propVs.getValuesetBindings() != null ) {
              Set<String> vsIds = this.bindingService.processValueSetBinding(propVs.getValuesetBindings());
              if(vsIds != null && !vsIds.isEmpty()) {
                vsIds.forEach((s) -> {
                  relations.add(new RelationShip(new ReferenceIndentifier(s, Type.VALUESET),
                      new ReferenceIndentifier(pcId, Type.PROFILECOMPONENT),
                      new ReferenceLocation(Type.PROFILECOMPONENTITEM, resourceName , item.getPath().replaceAll("-", "."))) );
                }) ;
              }
            }
          }
          if(prop instanceof PropertySingleCode) {
            PropertySingleCode propSingleCode = (PropertySingleCode)prop;
            //TODO update single code references.
          }
        }
      }
    }

    return relations;
  }

  private String getResourceLabel(ProfileComponentContext ctx) {
    String ret = "";
    if(ctx.getLevel().equals(Type.SEGMENT)) {
      Segment s = this.segmentService.findById(ctx.getSourceId());
      if(s !=null) {
        ret = s.getLabel();
      }
    }else if(ctx.getLevel().equals(Type.CONFORMANCEPROFILE)) {
      ConformanceProfile cp = this.conformanceProfileService.findById(ctx.getSourceId());
      if(cp != null) {
        ret = cp.getLabel();
      }      
    }
    return ret;
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
  public void applyChanges(ProfileComponent pc, List<ChangeItemDomain> cItems, String documentId) throws ApplyChangeException {

    Map<PropertyType,ChangeItemDomain> singlePropertyMap = applyChange.convertToSingleChangeMap(cItems);
    this.applyMetaData(pc, singlePropertyMap , documentId);
    this.save(pc);
  }

  private void applyMetaData( ProfileComponent cp, Map<PropertyType, ChangeItemDomain> singlePropertyMap, String documentId) throws ApplyChangeException{

    applyChange.applyResourceChanges(cp, singlePropertyMap , documentId);
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
  public List<PropertyDynamicMapping> updateContextDynamicMapping(String pcId, String contextId,
      List<PropertyDynamicMapping> dynamicMappingItems) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException {
    Set<ItemProperty> toAdd =  new HashSet<ItemProperty>();
    toAdd.addAll(dynamicMappingItems);
    ProfileComponentContext pcContext = this.findContextById(pcId, contextId);
    if(pcContext.getProfileComponentItems() != null && !pcContext.getProfileComponentItems().isEmpty() ) {
      for(ProfileComponentItem item: pcContext.getProfileComponentItems()) {
        if(item.getPath() == null || item.getPath().isEmpty() || item.getPath().equals("0") || item.getPath().equals("-1") ){
          if(item.getItemProperties() != null) {
            item.getItemProperties().removeIf((x) -> x.getPropertyKey().equals(PropertyType.DYNAMICMAPPINGITEM));
            item.getItemProperties().addAll(dynamicMappingItems);
          }else {
            item.setItemProperties(new HashSet<ItemProperty>());
            item.getItemProperties().addAll(toAdd);
          }
        }
      }
    }else {
      pcContext.setProfileComponentItems(new HashSet<ProfileComponentItem>());
      ProfileComponentItem item = new ProfileComponentItem();
      item.setItemProperties(toAdd);
      pcContext.getProfileComponentItems().add(item);
     
    }
    
    
    this.updateContext(pcId, contextId, pcContext);
    return dynamicMappingItems;

  }



}
