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
package gov.nist.hit.hl7.igamt.conformanceprofile.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBindingContained;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBindingRef;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintDependencyService;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependency;
import gov.nist.hit.hl7.igamt.conformanceprofile.wrappers.ConformanceProfileDependencies;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class ConformanceProfileDependencyServiceImpl implements ConformanceProfileDependency {


  @Autowired
  SegmentDependencyService segmentDependencyService;

  @Autowired
  SegmentService segmentService;
  
  @Autowired
  CoConstraintDependencyService coConstraintDependencyService;
  @Autowired
  CoConstraintService coConstraintService;
  

  @Override
  public void updateDependencies(ConformanceProfile resource, HashMap<RealKey, String> newKeys) {
  }

  @Override
  public ConformanceProfileDependencies getDependencies(ConformanceProfile resource, DependencyFilter filter) throws EntityNotFound {
    ConformanceProfileDependencies conformanceProfileDependencies = new ConformanceProfileDependencies();


    ResourceBindingProcessor rb = new ResourceBindingProcessor(resource.getBinding());


    for(MsgStructElement segOrgroup:  resource.getChildren()) {
      if (segOrgroup instanceof SegmentRef) {
        SegmentRef ref = (SegmentRef) segOrgroup;
        if (ref.getRef() != null && ref.getRef().getId() != null ) {
          if(conformanceProfileDependencies.getSegments().containsKey(ref.getRef().getId())) {
            Segment s = segmentService.findById(ref.getRef().getId());
            conformanceProfileDependencies.getSegments().put(ref.getRef().getId(), s);
            rb.addChild(s.getBinding(), segOrgroup.getId());
            this.segmentDependencyService.process(s, conformanceProfileDependencies, filter, rb, segOrgroup.getId());
          }
        }
      } else if (segOrgroup instanceof Group) {
        Group g = (Group) segOrgroup;
        for (MsgStructElement child : g.getChildren()) {
          processSegmentorGroup(child, conformanceProfileDependencies, filter, rb, g.getId());
        }
      }
    }
    if(resource.getCoConstraintsBindings() != null) {
      
      
      this.processCoConstraintsBinding(resource.getCoConstraintsBindings(),conformanceProfileDependencies, filter);
      
    }

    
    
    return conformanceProfileDependencies;
  }


  /**
   * @param coConstraintsBindings
   * @param conformanceProfileDependencies
   * @param filter
   * @throws EntityNotFound 
   */
  public void processCoConstraintsBinding(List<CoConstraintBinding> coConstraintsBindings,
      ConformanceProfileDependencies conformanceProfileDependencies, DependencyFilter filter) throws EntityNotFound {
    for(CoConstraintBinding binding:coConstraintsBindings) {
      if(binding.getBindings()!=null) {
        for(CoConstraintBindingSegment segBinding: binding.getBindings()) {
    
          if(segBinding.getTables() !=null) {
            for( CoConstraintTableConditionalBinding CoConstraintTableConditionalBinding : segBinding.getTables()) {
              if(CoConstraintTableConditionalBinding.getValue() !=null) {
                this.process(CoConstraintTableConditionalBinding.getValue(), conformanceProfileDependencies, filter);
              }
            }
          }
        }
      }     
    }
  }

  public void processSegmentorGroup(MsgStructElement segOrgroup,  ConformanceProfileDependencies used, DependencyFilter filter, ResourceBindingProcessor rb, String parent) {
    if (segOrgroup instanceof SegmentRef) {
      SegmentRef ref = (SegmentRef) segOrgroup;
      if (ref.getRef() != null && ref.getRef().getId() != null ) {
        if(used.getSegments().containsKey(ref.getRef().getId())) {
          Segment s = segmentService.findById(ref.getRef().getId());
          rb.addChild(s.getBinding(), segOrgroup.getId());
          this.segmentDependencyService.process(s, used, filter, rb, parent+'-'+ segOrgroup.getId());
          rb.addChild(s.getBinding(), parent+'-'+ segOrgroup.getId());
          used.getSegments().put(ref.getRef().getId(), s);
        }
      }
    } else if (segOrgroup instanceof Group) {
      Group g = (Group) segOrgroup;
      for (MsgStructElement child : g.getChildren()) {
        processSegmentorGroup(child, used, filter, rb, parent+'-'+ child.getId() );
      }
    }
  }
  
  public void process(
      CoConstraintTable value,  ConformanceProfileDependencies used, DependencyFilter filter) throws EntityNotFound {
    if(value.getGroups() !=null) {
      for(CoConstraintGroupBinding groupBinding : value.getGroups()) {
        if(groupBinding instanceof CoConstraintGroupBindingContained) {
          CoConstraintGroupBindingContained  contained = (CoConstraintGroupBindingContained)(groupBinding);
          if(contained.getCoConstraints() !=null) {
            contained.getCoConstraints().stream().forEach( cc -> {
              this.coConstraintDependencyService.process(cc, used, filter);
            });
          }
        }else if(groupBinding instanceof CoConstraintGroupBindingRef) {
          CoConstraintGroupBindingRef ref = (CoConstraintGroupBindingRef)groupBinding;
          if(ref.getId() != null && !used.getCoConstraintGroups().containsKey(ref.getId())) {
            CoConstraintGroup ccg = this.coConstraintService.findById(ref.getId());
            this.coConstraintDependencyService.process(ccg, used, filter);
          }
        }
      }
    };
    if(value.getCoConstraints() !=null) {
      value.getCoConstraints().stream().forEach( cc -> {
        this.coConstraintDependencyService.process(cc, used, filter);
      });
    }
  }
  
  
  



}
