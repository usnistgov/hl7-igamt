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
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.base.wrappers.Substitue;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

import gov.nist.hit.hl7.igamt.ig.service.ResourceHelper;
import gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;
import gov.nist.hit.hl7.resource.change.service.ApplyClone;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class ResourceManagementServiceImpl implements ResourceManagementService {

  @Autowired
  ResourceHelper resourceHelper;

  @Autowired
  ApplyClone applyClone;

  @Autowired
  FhirHandlerService fhirHandlerService;
  @Autowired
  MessageStructureRepository messageStructureRepository;
  @Autowired
  ConformanceProfileService conformanceProfileService;
  @Autowired
  BindingService bindingService;
  @Autowired
  CoConstraintService coConstraintService;
  
  @Autowired
  SegmentService segmentService;

  @Override
  public <T extends Resource> T createFlavor(Registry reg, String username, DocumentInfo documentInfo, Type resourceType, AddingInfo selected) throws EntityNotFound, ForbiddenOperationException {

    T resource = this.getElmentFormAddingInfo(username, documentInfo, resourceType, selected);
    if(selected.isFlavor()) {
      this.applyFlavorInfo(resource, selected);
      resource = this.resourceHelper.saveByType(resource, resourceType);
    }
    Link link = resourceHelper.generateLink(resource, documentInfo, reg.getChildren().size()+1);
    reg.getChildren().add(link);
    return resource;
  }

  @Override
  public <T extends Resource> T getElmentFormAddingInfo(String username, DocumentInfo documentInfo, Type resourceType, AddingInfo selected) throws EntityNotFound {

    T resource = this.resourceHelper.getResourceByType(selected.getOriginalId(), resourceType); 
    if(selected.isFlavor()) {
      applyClone.updateResourceAttributes(resource, this.resourceHelper.generateAbstractDomainId(), username, documentInfo);
      this.applyFlavorInfo(resource, selected);   
    }
    return resource;
  }

  /**
   * @param resource
   * @param addingInfo
   */
  private void applyFlavorInfo(Resource resource, AddingInfo addingInfo) {

    if(resource instanceof Datatype) {
      ((Datatype) resource).setExt(addingInfo.getExt());
      if(resource.getDomainInfo().getScope().equals(Scope.SDTF)) {
        ((Datatype) resource).setFixedExtension(((Datatype) resource).getExt());
      }
    }else if(resource instanceof Segment ) {
      ((Segment) resource).setExt(addingInfo.getExt());
    }else if(resource instanceof Valueset) {
      this.applyValueSetFlavorInfo(((Valueset) resource), addingInfo);
    }else if( resource instanceof CompositeProfileStructure) {
      ((CompositeProfileStructure)resource).setName(addingInfo.getExt());
    }else if (resource instanceof ProfileComponent) {
      ((Segment) resource).setExt(addingInfo.getExt());
    }else if (resource instanceof ConformanceProfile) {
      ((ConformanceProfile)resource).setName(addingInfo.getExt());
    }
    resource.getDomainInfo().setScope(Scope.USER);
    this.updateReasonForChange(resource);

  }

  // TODDOO review requirment
  private void applyValueSetFlavorInfo(Valueset valueset, AddingInfo addingInfo) {
    if(valueset.getBindingIdentifier().equals("HL70396") && valueset.getSourceType().equals(SourceType.EXTERNAL)) {
      valueset.setSourceType(SourceType.INTERNAL);
      valueset.setOrigin(valueset.getId());
      Set<Code> vsCodes = fhirHandlerService.getValusetCodeForDynamicTable();
      valueset.setCodes(vsCodes);
    }
    valueset.setBindingIdentifier(addingInfo.getExt());


  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService#createProfile(java.lang.String, gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo, gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo)
   */
  @Override
  public ConformanceProfile createProfile(String username, DocumentInfo documentInfo,
      AddingInfo ev) throws ForbiddenOperationException {
    MessageStructure profile = messageStructureRepository.findOneById(ev.getOriginalId());

    ConformanceProfile clone = new ConformanceProfile(profile, ev.getName());
    if(ev.getSubstitutes() != null && !ev.getSubstitutes().isEmpty()) {
      this.subsitute(clone, ev.getSubstitutes(), username, documentInfo);
    }
    this.applyClone.updateResourceAttributes(clone, clone.getId(), username, documentInfo);
    clone.getDomainInfo().setScope(Scope.USER);
    clone.setDescription(ev.getDescription());
    clone.setIdentifier(ev.getExt());
    clone.setName(ev.getExt());
    conformanceProfileService.save(clone);
    return clone;
  }


  @Override
  public  void applyCloneResource(Resource resource, String newId, String username, DocumentInfo info , CloneMode mode ) {
    this.applyClone.updateResourceAttributes(resource, newId, username, info);
    if(resource instanceof CoConstraintGroup) {
      applyCoConstraintCloneTag((CoConstraintGroup) resource);
    } else if(resource instanceof ConformanceProfile) {
      applyCoConstraintCloneTag((ConformanceProfile) resource);
    }

    if(mode.equals(CloneMode.DERIVE)) {
      this.lockConformanceStatements(resource);
      resource.setDerived(true);
      resource.setOrigin(resource.getFrom());
    }
    this.updateReasonForChange(resource);
  }

  private void updateReasonForChange(Resource resource) {
    if(resource instanceof ConformanceProfile) {

      this.initializeBindingReasonForChange(((ConformanceProfile)resource).getBinding());
      this.initializeStructureForChange(((ConformanceProfile)resource).getChildren());
    }
    if(resource instanceof Segment) {
      this.initializeBindingReasonForChange(((Segment)resource).getBinding());
      this.initializeStructureForChange(((Segment)resource).getChildren());
    }  
    if(resource instanceof ComplexDatatype) {
      this.initializeBindingReasonForChange(((ComplexDatatype)resource).getBinding());

      this.initializeStructureForChange(((ComplexDatatype)resource).getComponents());
    }
    if(resource instanceof Valueset) {
      ((Valueset)resource).setChangeLogs(null);
    }
  }

  <T extends StructureElement> void initializeStructureForChange(Set<T> children ) {
    if(children != null) {
      for ( T child: children) {
        child.setChangeLog(null);
        if(child instanceof Group) {
          initializeStructureForChange(((Group)child).getChildren());
        }
      }
    }
  }



  /**
   * @param binding
   */
  private void initializeBindingReasonForChange(ResourceBinding binding) {
    if(binding != null) {
      binding.setConformanceStatementsChangeLog(null);
      if(binding.getChildren() != null) {
        for (StructureElementBinding structureElementBinding: binding.getChildren()) {
          this.initializeBindingReasonForChange(structureElementBinding);
        }
      }
    }
  }

  private void initializeBindingReasonForChange(StructureElementBinding structureElementBinding) {
    structureElementBinding.setChangeLog(null);
    if(structureElementBinding.getChildren() != null) {
      for (StructureElementBinding child: structureElementBinding.getChildren()) {
        this.initializeBindingReasonForChange(child);
      }
    }
  }

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

  
  
  public void subsitute(ConformanceProfile cp, List<Substitue> substitutes, String username, DocumentInfo documentInfo) throws ForbiddenOperationException {
    HashMap<RealKey, String> newKeys = new HashMap<RealKey, String>();
    for(Substitue sub: substitutes) {
      RealKey segKey = new RealKey(sub.getOriginalId(), Type.SEGMENT);
      if(sub.isCreate()) {
        Segment segment = this.segmentService.findById(sub.getOriginalId());
        if(segment !=null) {
          applyClone.updateResourceAttributes(segment, this.resourceHelper.generateAbstractDomainId(), username, documentInfo);
          segment.getDomainInfo().setScope(Scope.USER);
          segment.setExt(sub.getExt());

          segment = segmentService.save(segment);
          newKeys.put(segKey, segment.getId());
        }
      }else {
        newKeys.put(segKey, sub.getNewId());
      }
    }
    this.conformanceProfileService.processAndSubstitute(cp, newKeys);
  }

}
