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
package gov.nist.hit.hl7.igamt.segment.service.impl;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slice;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.wrappers.SegmentDependencies;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class SegmentDependencyServiceImpl implements SegmentDependencyService {



  @Autowired
  DatatypeService datatypeService;
  @Autowired
  DatatypeDependencyService datatypeDependencyService;

  @Override
  public void updateDependencies(Segment resource, HashMap<RealKey, String> newKeys) {
    // TODO Auto-generated method stub

  }


  @Override
  public SegmentDependencies getDependencies(Segment resource, DependencyFilter filter) {

    SegmentDependencies ret = new SegmentDependencies();

    ResourceBindingProcessor rb = new ResourceBindingProcessor(resource.getBinding());
    this.process(resource, ret, filter, rb, null);

    return ret;
  }



  @Override
  public void process(Segment segment, SegmentDependencies used, DependencyFilter filter,
      ResourceBindingProcessor rb, String path) {

    Map<String, Slicing> slicingMap =  segment.getSlicings() != null ?  segment.getSlicings().stream().collect(
        Collectors.toMap(x -> x.getPath(), x -> x)) : new HashMap<String, Slicing>();

        for (Field f : segment.getChildren()) {
          String pathId = path != null? path + '-' + f.getId(): f.getId();

          if(!isFiltered(filter, f )) {
            if(rb.getBindingFor(pathId) != null) {
              this.processResourceBinding(used.getValuesets(), rb, pathId);
            }
            if (f.getRef() != null ) {
              if (f.getRef().getId() != null && !used.getDatatypes().containsKey(f.getRef().getId())) {

                Datatype d = datatypeService.findById(f.getRef().getId());
                used.getDatatypes().put(d.getId(), d);
                rb.addChild(d.getBinding(), pathId);
                datatypeDependencyService.process(d, used, filter, rb, pathId);
              }
            }
            if(slicingMap.containsKey(f.getId())) {
              this.processSlicing(slicingMap.get(f.getId()), used, filter, pathId);
            }
          }
        }
        if(segment.getDynamicMappingInfo() != null && segment.getDynamicMappingInfo().getItems() != null ) {

          for (DynamicMappingItem item : segment.getDynamicMappingInfo().getItems()) {
            if(item.getDatatypeId() != null && !used.getDatatypes().containsKey(item.getDatatypeId())) {
              Datatype d = datatypeService.findById(item.getDatatypeId());
              used.getDatatypes().put(item.getDatatypeId(), d);
              if (d instanceof ComplexDatatype) {
                datatypeDependencyService.process((ComplexDatatype)d, used, filter, new ResourceBindingProcessor(d.getBinding()) , null);
              }
            }
          }
        }
  }


  /**
   * @param slicing
   * @param used
   */
  private void processSlicing(Slicing slicing, SegmentDependencies used, DependencyFilter filter, String path) {

    if(slicing instanceof ConditionalSlicing ) {  
      this.processSlices(((ConditionalSlicing) slicing).getSlices(), used, filter, path);
    }else if (slicing instanceof OrderedSlicing){
      this.processSlices(((OrderedSlicing) slicing).getSlices(), used, filter, path);
    }
  }

  /**
   * @param valuesets
   * @param rb
   * @param pathId 
   */
  private void processResourceBinding(HashMap<String, Valueset> valuesets,
      ResourceBindingProcessor rb, String pathId) {

  }


  /**
   * @return
   */
  private boolean isFiltered(DependencyFilter filter, Field f ) {
    return false;
  }

  private <T extends Slice> void processSlices(List<T> slices, SegmentDependencies used, DependencyFilter filter, String path) {
    if(slices != null) {
      for ( T slice: slices) {
        if(slice.getFlavorId() != null &&  !used.getDatatypes().containsKey(slice.getFlavorId())) {
          Datatype d = datatypeService.findById(slice.getFlavorId());
          used.getDatatypes().put(slice.getFlavorId(), d);
            if (d instanceof ComplexDatatype) {
              datatypeDependencyService.process((ComplexDatatype)d, used, filter, new ResourceBindingProcessor(d.getBinding()) , null);
            }
          }
      }
    }
  }
}
