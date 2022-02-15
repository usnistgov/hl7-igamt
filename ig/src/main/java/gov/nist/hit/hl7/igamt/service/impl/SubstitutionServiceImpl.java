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

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class SubstitutionServiceImpl {
  
  @Autowired
  SlicingService slicingService;
  
  @Autowired
  CommonService commonService;

  @Autowired
  BindingService bindingService;
  
  @Autowired
  CoConstraintService coConstraintService;
  
  private void updateDependencies(Datatype elm, HashMap<RealKey, String> newKeys, CloneMode cloneMode) {
    // TODO Auto-generated method stub

    if (elm instanceof ComplexDatatype) {
        for (Component c : ((ComplexDatatype) elm).getComponents()) {
            if (c.getRef() != null) {
                if (c.getRef().getId() != null) {
                  RealKey key = new RealKey(c.getRef().getId(), Type.DATATYPE);
                    if (newKeys.containsKey(key)) {
                        c.getRef().setId(newKeys.get(key));
                    }
                }
            }
        }
    }
    if (elm.getBinding() != null) {
        this.bindingService.substitute(elm.getBinding(), newKeys);
         if(cloneMode.equals(CloneMode.DERIVE)) {
              this.bindingService.lockConformanceStatements(elm.getBinding());
            }
    }
}
  
  private void updateDependencies(Segment elm, HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {
    // TODO Auto-generated method stub

    for (Field f : elm.getChildren()) {
      if (f.getRef() != null) {
        if (f.getRef().getId() != null) {
          RealKey key = new RealKey(f.getRef().getId(), Type.DATATYPE);
          if (newKeys.containsKey(key)) {
            f.getRef().setId(newKeys.get(key));
          }
        }
      }
    }
    this.bindingService.substitute(elm.getBinding(), newKeys);
    if(cloneMode.equals(CloneMode.DERIVE)) {
      this.bindingService.lockConformanceStatements(elm.getBinding());
    }
    if(elm.getSlicings() != null) {
      this.slicingService.updateSlicing(elm.getSlicings(), newKeys, Type.DATATYPE);
    }
    updateDynamicMapping(elm, newKeys);
  }
  

  private void updateDynamicMapping(Segment segment, HashMap<RealKey, String> newKeys) {
    if (segment.getDynamicMappingInfo() != null) {
      if (segment.getDynamicMappingInfo().getItems() != null) {
        segment.getDynamicMappingInfo().getItems().forEach(item -> {
          RealKey key = new RealKey(item.getDatatypeId(), Type.DATATYPE);
          if (newKeys.containsKey(key)) {
            item.setDatatypeId(newKeys.get(key));
          }
        });
      }
    }
  }
  
  private void updateDependencies(ConformanceProfile elm, HashMap<RealKey, String> newKeys, CloneMode cloneMode) {
    // TODO Auto-generated method stub

    processAndSubstitute(elm, newKeys);
    if (elm.getBinding() != null) {
      this.bindingService.substitute(elm.getBinding(), newKeys);
      if(cloneMode.equals(CloneMode.DERIVE)) {
        this.bindingService.lockConformanceStatements(elm.getBinding());
      }
    }
    if(elm.getSlicings() != null) {
      this.slicingService.updateSlicing(elm.getSlicings(), newKeys, Type.SEGMENT);
    }
    if (elm.getCoConstraintsBindings() != null) {
      for (CoConstraintBinding binding : elm.getCoConstraintsBindings()) {
        if (binding.getBindings() != null) {
          for (CoConstraintBindingSegment segBinding : binding.getBindings()) {
            // TODO Review Line Below
//            RealKey segKey = new RealKey(segBinding.getFlavorId(), Type.SEGMENT);
//            if (segBinding.getFlavorId() != null && newKeys.containsKey(segKey)) {
//              segBinding.setFlavorId(newKeys.get(segKey));
//            }
            if (segBinding.getTables() != null) {
              for (CoConstraintTableConditionalBinding ccBinding : segBinding.getTables()) {
                if (ccBinding.getValue() != null) {
                  this.coConstraintService.updateDepenedencies(ccBinding.getValue(), newKeys);
                }
              }
            }
          }
        }
      }
    }
  }
  
  private void processAndSubstitute(ConformanceProfile cp, HashMap<RealKey, String> newKeys) {
    // TODO Auto-generated method stub
    for (MsgStructElement segOrgroup : cp.getChildren()) {
      processAndSubstituteSegmentorGroup(segOrgroup, newKeys);
    }

  }

  private void processAndSubstituteSegmentorGroup(MsgStructElement segOrgroup, HashMap<RealKey, String> newKeys) {
    // TODO Auto-generated method stub
    if (segOrgroup instanceof SegmentRef) {
      SegmentRef ref = (SegmentRef) segOrgroup;
      if (ref.getRef() != null && ref.getRef().getId() != null) {
        RealKey key = new RealKey(ref.getRef().getId(), Type.SEGMENT);
        if (newKeys.containsKey(key)) {
          ref.getRef().setId(newKeys.get(key));
        }
      }
    } else if (segOrgroup instanceof Group) {
      Group g = (Group) segOrgroup;
      for (MsgStructElement child : g.getChildren()) {
        processAndSubstituteSegmentorGroup(child, newKeys);
      }
    }

  }
  
  private void updateDependencies(CompositeProfileStructure elm, HashMap<RealKey, String> newKeys,
      CloneMode cloneMode) {
    if(elm.getConformanceProfileId() != null) {
      RealKey key = new RealKey(elm.getConformanceProfileId(), Type.CONFORMANCEPROFILE);
      if(newKeys.containsKey(key)){
        elm.setConformanceProfileId(newKeys.get(key));
      }
    }
    if(elm.getOrderedProfileComponents() != null) {
      for(OrderedProfileComponentLink child: elm.getOrderedProfileComponents()) {
        RealKey key = new RealKey(child.getProfileComponentId(), Type.PROFILECOMPONENT);
        if(newKeys.containsKey(key)) {
          child.setProfileComponentId(newKeys.get(key));
        }
      }
    }
  }
  

}
