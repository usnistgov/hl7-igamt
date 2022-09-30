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
package gov.nist.hit.hl7.igamt.bootstrap.data;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xlsx4j.sml.CTX;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.ResourceOrigin;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItemBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyValueSet;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class PhinvadFixer {

  @Autowired
  private ValuesetService valueSetService;
  @Autowired
  private IgService igService;
  @Autowired
  private IgRepository igRepo;
  @Autowired
  private BindingService bindingService;
  @Autowired
  private ConformanceProfileService conformanceProfileService;
  @Autowired
  private CoConstraintService coConstraintService;
  @Autowired
  private SegmentService segmentService;
  @Autowired
  private DatatypeService datatypeService;
  @Autowired
  private ProfileComponentService profileComponentService;


  public void setValueSetOrigins() throws ForbiddenOperationException {
    List<Valueset> valueSets = valueSetService.findAll();
    for(Valueset vs: valueSets) {
      if(vs.getDomainInfo().getScope().equals(Scope.PHINVADS) || (vs.getBindingIdentifier() != null && vs.getBindingIdentifier().startsWith("PHVS"))) {
        if(vs.getResourceOrigin() ==null) {
          vs.setResourceOrigin(ResourceOrigin.PHINVADS);   
        }
      }else {
        vs.setResourceOrigin(ResourceOrigin.HL7);
      }
      valueSetService.save(vs);
    }
  }

  public void update() throws EntityNotFound {
    List<Ig> igs = igService.findAll();
    for(Ig ig: igs) {
      HashMap<RealKey, String> newKeys= new HashMap<RealKey, String>();
      for(Link l: ig.getValueSetRegistry().getChildren()) {
        if(l.getDomainInfo().getScope().equals( Scope.PHINVADS) ){

          Valueset vs = valueSetService.findById(l.getId());
          if(vs.isFlavor()) {
            vs.setResourceOrigin(ResourceOrigin.PHINVADS);
            l.getDomainInfo().setScope(Scope.USER);
            if(ig.getUsername() != vs.getUsername()) {
              String newId = new ObjectId().toString();
              CloneMode cloneMode = ig.isDerived() ? CloneMode.DERIVE : CloneMode.CLONE;
            //  Link newLink = this.valueSetService.cloneValueSet(newId, l, ig.getUsername(), Scope.USER, cloneMode);

//              l.setDerived(newLink.isDerived());
//              l.setDomainInfo(newLink.getDomainInfo());
//              l.setUsername(newLink.getUsername());
//              l.setParentType(newLink.getParentType());
//              l.setType(newLink.getType());
//              l.setDerived(newLink.isDerived());
//              l.setPosition(newLink.getPosition());
//              Set<RelationShip> relations = igService.buildRelationShip(ig, Type.VALUESET);
//              Set<RelationShip> usages = igService.findUsage(relations, Type.VALUESET, l.getId());
//              if(!usages.isEmpty()) {
//                newKeys.put(new RealKey(l.getId(), Type.VALUESET), newId);
//                this.replace(relations, newKeys, vs.getUsername());
//              }
//              l.setId(newLink.getId());
              igRepo.save(ig);
            }
          }
        }
      }
    }
  }

  /**
   * @param ig
   * @param newKeys
   * @throws EntityNotFound 
   */
  private void replace(Set<RelationShip> relations, HashMap<RealKey, String> newKeys, String username) throws EntityNotFound {
    for(RelationShip relation : relations) {
      if( relation.getParent().getType().equals(Type.CONFORMANCEPROFILE)) {
        ConformanceProfile elm = conformanceProfileService.findById(relation.getParent().getId());
        if(elm.getBinding() != null){
          this.bindingService.substitute(elm.getBinding(), newKeys);
        }
        if (elm.getCoConstraintsBindings() != null) {
          for (CoConstraintBinding binding : elm.getCoConstraintsBindings()) {
            if (binding.getBindings() != null) {
              for (CoConstraintBindingSegment segBinding : binding.getBindings()) {
                if (segBinding.getTables() != null) {
                  for (CoConstraintTableConditionalBinding ccBinding : segBinding.getTables()) {
                    if (ccBinding.getValue() != null) {
                  //    this.coConstraintService.updateDepenedencies(ccBinding.getValue(), newKeys, true);
                    }
                  }
                }
              }
            }
          }
        }
        conformanceProfileService.save(elm);

      }else if (relation.getParent().getType().equals(Type.SEGMENT)) {
        Segment elm = segmentService.findById(relation.getParent().getId());
        if(elm.getBinding() != null){
          this.bindingService.substitute(elm.getBinding(), newKeys);
        }
       // segmentService.save(elm);

      }else if(relation.getParent().getType().equals(Type.DATATYPE)) {
        Datatype elm = datatypeService.findById(relation.getParent().getId());
        if(elm.getBinding() != null){
          this.bindingService.substitute(elm.getBinding(), newKeys);
        }
      //  datatypeService.save(elm);

      }else if(relation.getParent().getType().equals(Type.COCONSTRAINTGROUP)) {
        CoConstraintGroup cc =  coConstraintService.findById(relation.getParent().getId());
        //coConstraintService.updateDependencies(cc, newKeys,username); 
        coConstraintService.saveCoConstraintGroup(cc);
      }else if (relation.getParent().getType().equals(Type.PROFILECOMPONENT)) {
        ProfileComponent elm = profileComponentService.findById(relation.getParent().getId());

        for(ProfileComponentContext context: elm.getChildren()) {

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
          }
          
          if(context.getProfileComponentCoConstraints() != null) {  
              for (CoConstraintBinding binding : context.getProfileComponentCoConstraints().getBindings()) {
                if (binding.getBindings() != null) {
                  for (CoConstraintBindingSegment segBinding : binding.getBindings()) {
                    if (segBinding.getTables() != null) {
                      for (CoConstraintTableConditionalBinding ccBinding : segBinding.getTables()) {
                        if (ccBinding.getValue() != null) {
                      //    this.coConstraintService.updateDepenedencies(ccBinding.getValue(), newKeys, true);
                        }
                      }
                    }
                  }
                }
              }
          }
        }
        profileComponentService.save(elm);
      }
    }

  }

}
