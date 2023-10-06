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

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintDependencyService;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItemBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PcDynamicMappingItem;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDatatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyRef;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyValueSet;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentDependencyService;
import gov.nist.hit.hl7.igamt.profilecomponent.wrappers.ProfileComponentDependencies;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class ProfileComponentDependencyServiceImpl implements ProfileComponentDependencyService {

  @Autowired
  SegmentService segmentService;

  @Autowired
  SegmentDependencyService segmentDependencyService;

  @Autowired
  ConformanceProfileDependencyService conformanceProfileDependencyService;
  
  @Autowired
  CoConstraintDependencyService coConstraintDependencyService;

  @Autowired 
  ConformanceProfileService conformanceProfileService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  DatatypeDependencyService datatypeDependencyService;

  @Autowired
  ValuesetService valuesetService;

  @Autowired
  BindingService bindingService;


  @Override
  public void updateDependencies(ProfileComponent elm, HashMap<RealKey, String> newKeys) {

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
        }
      }

      if(context.getProfileComponentBindings()!= null) {
        if(context.getProfileComponentBindings().getItemBindings() != null) {
          for (ProfileComponentItemBinding profileComponentItemBinding: context.getProfileComponentBindings().getItemBindings()) {
            if(profileComponentItemBinding.getBindings() != null) {
              for (PropertyBinding propertyBinding : profileComponentItemBinding.getBindings() ) {
                if(propertyBinding instanceof PropertyValueSet) {
                  PropertyValueSet propVs =  (PropertyValueSet)propertyBinding;
                  this.bindingService.processAndSubstitute(propVs.getValuesetBindings(), newKeys);          
                }
              }
            }
          } 
        }
        if(context.getProfileComponentBindings().getContextBindings() != null) {
          for (PropertyBinding propertyBinding: context.getProfileComponentBindings().getContextBindings()) {
            if(propertyBinding instanceof PropertyValueSet) {
              PropertyValueSet propVs =  (PropertyValueSet)propertyBinding;
              this.bindingService.processAndSubstitute(propVs.getValuesetBindings(), newKeys);          
            }
          }
        }
        
        if (context.getProfileComponentCoConstraints() != null) {
          
            for (CoConstraintBinding binding : context.getProfileComponentCoConstraints().getBindings()) {
              if (binding.getBindings() != null) {
                for (CoConstraintBindingSegment segBinding : binding.getBindings()) {
                  if (segBinding.getTables() != null) {
                    for (CoConstraintTableConditionalBinding ccBinding : segBinding.getTables()) {
                      if (ccBinding.getValue() != null) {
                        this.coConstraintDependencyService.updateDepenedencies(ccBinding.getValue(), newKeys);
                      }
                    }
                  }
                }
              }
            }
         }
        if(context.getProfileComponentDynamicMapping() != null) {
          
          if(context.getProfileComponentDynamicMapping().getItems() != null) {
            for( PcDynamicMappingItem item: context.getProfileComponentDynamicMapping().getItems()) {   
              RealKey key = new RealKey(item.getFlavorId(), Type.DATATYPE);
              if (newKeys.containsKey(key)) {
                item.setFlavorId(newKeys.get(key));
              }
            }
          }
        }
      }
    }
  }

  @Override
  public ProfileComponentDependencies getDependencies(ProfileComponent resource,
      DependencyFilter filter) throws EntityNotFound {
    
    ProfileComponentDependencies used = new ProfileComponentDependencies();
    this.process(resource, used, filter);
    
    return used;
  }

  @Override
  public void process(ProfileComponent pc , ProfileComponentDependencies used, DependencyFilter filter) throws EntityNotFound {
    if(pc.getChildren() != null) {
      for(ProfileComponentContext ctx: pc.getChildren()) {
        this.processContext(ctx, used, filter); 
      }
    }
  }



  private void processContext(ProfileComponentContext ctx,
      ProfileComponentDependencies profileComponentDependencies, DependencyFilter filter) throws EntityNotFound {

    if(ctx.getLevel().equals(Type.SEGMENT)) {

      if(ctx.getSourceId() != null) {

        this.segmentDependencyService.visit(ctx.getSourceId() , profileComponentDependencies.getSegments(), profileComponentDependencies, filter, new ResourceBindingProcessor(), null);
      }
      if(ctx.getProfileComponentDynamicMapping() != null) {
        if(ctx.getProfileComponentDynamicMapping().getItems() != null) {
          for( PcDynamicMappingItem item: ctx.getProfileComponentDynamicMapping().getItems()) {   
            if(item.getFlavorId() != null && !profileComponentDependencies.getDatatypes().containsKey(item.getFlavorId())) {
              datatypeDependencyService.visit(item.getFlavorId(),profileComponentDependencies.getDatatypes(), profileComponentDependencies, filter, new ResourceBindingProcessor() , null, new HashSet<>());
            }
          }
        }
      }     
    } else if(ctx.getLevel().equals(Type.CONFORMANCEPROFILE)) {

      if(ctx.getSourceId() != null && !profileComponentDependencies.getConformanceProfiles().containsKey(ctx.getSourceId())) {

        ConformanceProfile s = this.conformanceProfileService.findById(ctx.getSourceId());
        if(s != null ) {
          this.conformanceProfileDependencyService.process(s, profileComponentDependencies, filter);
        }
        if (ctx.getProfileComponentCoConstraints() != null && ctx.getProfileComponentCoConstraints().getBindings() != null) {

          this.conformanceProfileDependencyService.processCoConstraintsBinding(ctx.getProfileComponentCoConstraints().getBindings(), profileComponentDependencies, filter );
        }
      }
    }
    if(ctx.getProfileComponentItems() != null) {
      this.processItems(ctx, profileComponentDependencies, filter);
    }

  }

  void processItems( ProfileComponentContext ctx,
      ProfileComponentDependencies profileComponentDependencies, DependencyFilter filter) throws EntityNotFound{

    for(ProfileComponentItem item: ctx.getProfileComponentItems()) {
      if(item.getItemProperties() != null) {
        for(ItemProperty prop : item.getItemProperties()) {
          if(prop instanceof PropertyDatatype) {
            PropertyDatatype propDt =  (PropertyDatatype)prop;
            if(propDt.getDatatypeId() != null) {
              this.datatypeDependencyService.visit(propDt.getDatatypeId() , profileComponentDependencies.getDatatypes(), profileComponentDependencies, filter, new ResourceBindingProcessor(), null, new HashSet<>());
            }
          }
          if(prop instanceof PropertyRef) {
            PropertyRef propRef =  (PropertyRef)prop;
            if(propRef.getRef() != null) {
              this.segmentDependencyService.visit(propRef.getRef() , profileComponentDependencies.getSegments(), profileComponentDependencies, filter, new ResourceBindingProcessor(), null);

            }
          }
        }
      }
    }
    if(ctx.getProfileComponentBindings()!= null) {
      if(ctx.getProfileComponentBindings().getItemBindings() != null) {
        for (ProfileComponentItemBinding profileComponentItemBinding: ctx.getProfileComponentBindings().getItemBindings()) {
          if(profileComponentItemBinding.getBindings() != null) {
            for (PropertyBinding propertyBinding : profileComponentItemBinding.getBindings() ) {
              if(propertyBinding instanceof PropertyValueSet) {
                PropertyValueSet propVs =  (PropertyValueSet)propertyBinding;

                if(propVs.getValuesetBindings() != null ) {
                  bindingService.processValueSetBinding(propVs.getValuesetBindings(), profileComponentDependencies.getValuesets(), filter.getExcluded());  
                }
              }
            }
          }
        } 
      }
      if(ctx.getProfileComponentBindings().getContextBindings() != null) {
        for (PropertyBinding propertyBinding: ctx.getProfileComponentBindings().getContextBindings()) {
          if(propertyBinding instanceof PropertyValueSet) {
            PropertyValueSet propVs =  (PropertyValueSet)propertyBinding;

            if(propVs.getValuesetBindings() != null ) {
              bindingService.processValueSetBinding(propVs.getValuesetBindings(), profileComponentDependencies.getValuesets(), filter.getExcluded());  
            }
          }
        }
      }
    }
  }
  
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
        if (ctx.getProfileComponentCoConstraints() != null && ctx.getProfileComponentCoConstraints().getBindings() != null) {
          
         Set<RelationShip> CoConstraintsDependencies = coConstraintDependencyService.collectDependencies(new ReferenceIndentifier(pc.getId(), Type.PROFILECOMPONENT), ctx.getProfileComponentCoConstraints().getBindings());
            
         relations.addAll(CoConstraintsDependencies);
         }
        if(ctx.getProfileComponentDynamicMapping() != null) {
          
          
          if(ctx.getProfileComponentDynamicMapping().getItems() != null) {
            for( PcDynamicMappingItem item: ctx.getProfileComponentDynamicMapping().getItems()) {   
              
              
              relations.add(new RelationShip(new ReferenceIndentifier(item.getFlavorId(), Type.DATATYPE ),
                  new ReferenceIndentifier(pc.getId(), Type.PROFILECOMPONENT),
                  new ReferenceLocation(Type.DYNAMICMAPPING, "Profile Component Dynamic mapping", label))); 
            }
          }
        }
        
      }
    }

    return relations;
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
//          if(prop instanceof PropertyValueSet) {
//            PropertyValueSet propVs =  (PropertyValueSet)prop;
//            if(propVs.getValuesetBindings() != null ) {
//              Set<String> vsIds = this.bindingService.processValueSetBinding(propVs.getValuesetBindings());
//              if(vsIds != null && !vsIds.isEmpty()) {
//                vsIds.forEach((s) -> {
//                  relations.add(new RelationShip(new ReferenceIndentifier(s, Type.VALUESET),
//                      new ReferenceIndentifier(pcId, Type.PROFILECOMPONENT),
//                      new ReferenceLocation(Type.PROFILECOMPONENTITEM, resourceName , item.getPath().replaceAll("-", "."))) );
//                }) ;
//              }
//            }
//          }
        }
      }
    }
    if(ctx.getProfileComponentBindings()!= null) {
      if(ctx.getProfileComponentBindings().getItemBindings() != null) {
        for (ProfileComponentItemBinding profileComponentItemBinding: ctx.getProfileComponentBindings().getItemBindings()) {
          if(profileComponentItemBinding.getBindings() != null) {
            for (PropertyBinding propertyBinding : profileComponentItemBinding.getBindings() ) {
              if(propertyBinding instanceof PropertyValueSet) {
                PropertyValueSet propVs =  (PropertyValueSet)propertyBinding;

                if(propVs.getValuesetBindings() != null ) {
                  Set<String> vsIds = this.bindingService.processValueSetBinding(propVs.getValuesetBindings());
                  if(vsIds != null && !vsIds.isEmpty()) {
                    vsIds.forEach((s) -> {
                      relations.add(new RelationShip(new ReferenceIndentifier(s, Type.VALUESET),
                          new ReferenceIndentifier(pcId, Type.PROFILECOMPONENT),
                          new ReferenceLocation(Type.PROFILECOMPONENTITEM, resourceName , profileComponentItemBinding.getPath().replaceAll("-", "."))) );
                    }) ;
                  }
                }
              }
            }
          }
        } 
      }
      if(ctx.getProfileComponentBindings().getContextBindings() != null) {
        for (PropertyBinding propertyBinding: ctx.getProfileComponentBindings().getContextBindings()) {
          if(propertyBinding instanceof PropertyValueSet) {
            PropertyValueSet propVs =  (PropertyValueSet)propertyBinding;

            if(propVs.getValuesetBindings() != null ) {
              Set<String> vsIds = this.bindingService.processValueSetBinding(propVs.getValuesetBindings());
              if(vsIds != null && !vsIds.isEmpty()) {
                vsIds.forEach((s) -> {
                  relations.add(new RelationShip(new ReferenceIndentifier(s, Type.VALUESET),
                      new ReferenceIndentifier(pcId, Type.PROFILECOMPONENT),
                      new ReferenceLocation(Type.PROFILECOMPONENT, resourceName ,"")) );
                }) ;
              }
            }}
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

  private Type getContextType(Type level) {
    if(level.equals(Type.CONFORMANCEPROFILE)) {
      return Type.MESSAGECONTEXT;
    }else if (level.equals(Type.SEGMENT)){
      return Type.SEGMENTCONTEXT;
    }else return null;
  }

}
