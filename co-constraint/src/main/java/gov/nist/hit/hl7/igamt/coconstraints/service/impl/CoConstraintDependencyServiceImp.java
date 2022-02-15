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
package gov.nist.hit.hl7.igamt.coconstraints.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.DatatypeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueSetCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.VariesCell;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintDependencyService;
import gov.nist.hit.hl7.igamt.coconstraints.wrappers.CoConstraintsDependencies;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatype.wrappers.DatatypeDependencies;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class CoConstraintDependencyServiceImp implements CoConstraintDependencyService {

  @Autowired
  SegmentService segmentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  SegmentDependencyService segmentDependencyService;

  @Autowired
  DatatypeDependencyService datatypeDependencyService;  

  @Autowired
  ValuesetService valueSetService;

  @Override
  public void updateDependencies(CoConstraintGroup resource, HashMap<RealKey, String> newKeys) {

  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.resource.dependency.DependencyService#getDependencies(gov.nist.hit.hl7.igamt.common.base.domain.Resource, gov.nist.hit.hl7.resource.dependency.DependencyFilter)
   */
  @Override
  public CoConstraintsDependencies getDependencies(CoConstraintGroup resource,
      DependencyFilter filter) {



    return null;
  }
  @Override
  public void process(CoConstraintGroup ccGroup, CoConstraintsDependencies used,  DependencyFilter filter ) {
    if(ccGroup.getBaseSegment() != null && !used.getSegments().containsKey(ccGroup.getBaseSegment())) {

      Segment s = segmentService.findById(ccGroup.getBaseSegment());
      segmentDependencyService.process(s, used, filter, new ResourceBindingProcessor(s.getBinding()), null);
    }
    if(ccGroup.getCoConstraints()!= null) {
      for(CoConstraint cc :ccGroup.getCoConstraints() ) {
        this.process(cc, used, filter);
      }
    }

  }

  /**
   * @param cc
   * @param used
   * @param filter
   */
  @Override
  public void process(CoConstraint cc, CoConstraintsDependencies used, DependencyFilter filter) {

    if(cc.getCells()!=null) {
      for(Map.Entry<String, CoConstraintCell> entry : cc.getCells().entrySet()){
        this.process(entry.getValue(), used, filter );
      }
    }
  }
  @Override
  public void  process(CoConstraintCell cell,
      DatatypeDependencies used, DependencyFilter filter) {

    if(cell instanceof ValueSetCell) {
      ValueSetCell vsCell= (ValueSetCell)cell;
      if(vsCell.getBindings() !=null) {
        for(ValuesetBinding vsb : vsCell.getBindings()) {
          if(vsb.getValueSets() !=null ) {
            for(String vs : vsb.getValueSets()) {
              if(vs != null && !used.getValuesets().containsKey(vs)) { 
                Valueset valueSet = valueSetService.findById(vs);
                if(valueSet != null) {
                  used.getValuesets().put(vs, valueSet);
                }
              }
            }
          }
        }
      }else if(cell instanceof DatatypeCell ) {
        DatatypeCell dtCell= (DatatypeCell)cell; 
        if(dtCell.getDatatypeId() != null && !used.getDatatypes().containsKey(dtCell.getDatatypeId())) {
          Datatype d = datatypeService.findById(dtCell.getDatatypeId());
          if(d != null ) {
            used.getDatatypes().put(dtCell.getDatatypeId(), d);
            datatypeDependencyService.process(d, used, filter, new ResourceBindingProcessor(d.getBinding()), null);
          }
        }
      }else if(cell instanceof VariesCell) {
        VariesCell vrCell= (VariesCell)cell;
        if(vrCell.getCellValue() !=null) {
          process(vrCell.getCellValue(), used, filter);
        }
      }
    }
  }
  

}
