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
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.service.CommonFilteringService;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slice;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.segment.wrappers.SegmentDependencies;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class SegmentDependencyServiceImpl implements SegmentDependencyService {



  @Autowired
  DatatypeService datatypeService;
  @Autowired
  DatatypeDependencyService datatypeDependencyService;
  @Autowired
  SegmentService segmentService;
  @Autowired
  BindingService bindingService;
  @Autowired
  CommonFilteringService commonFilteringService;
  
  @Autowired
  SlicingService slicingService;

  @Override
  public void updateDependencies(Segment elm, HashMap<RealKey, String> newKeys) {
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
    if(elm.getSlicings() != null) {
      this.slicingService.updateSlicing(elm.getSlicings(), newKeys, Type.DATATYPE);
    }
    updateDynamicMapping(elm, newKeys);
  }


  @Override
  public SegmentDependencies getDependencies(Segment resource, DependencyFilter filter) throws EntityNotFound {

    SegmentDependencies ret = new SegmentDependencies();

    ResourceBindingProcessor rb = new ResourceBindingProcessor(resource.getBinding());
    this.process(resource, ret, filter, rb, null);

    return ret;
  }



  @Override
  public void process(Segment segment, SegmentDependencies used, DependencyFilter filter,
      ResourceBindingProcessor rb, String path) throws EntityNotFound {
    Map<String, Slicing> slicingMap =  segment.getSlicings() != null ?  segment.getSlicings().stream().collect(
        Collectors.toMap(x -> x.getPath(), x -> x)) : new HashMap<String, Slicing>();

        for (Field f : segment.getChildren()) {
          String pathId = path != null? path + '-' + f.getId(): f.getId();

          if(commonFilteringService.allow(filter.getUsageFilter(), f)) {

            bindingService.processValueSetBinding(rb.getValueSetBindings(pathId), used.getValuesets(), filter.getExcluded());  
        
            if (f.getRef() != null && f.getRef().getId() != null ) {
              datatypeDependencyService.visit(f.getRef().getId(), used.getDatatypes(), used, filter, rb, pathId);
            }
            if(slicingMap.containsKey(f.getId())) {
              this.processSlicing(slicingMap.get(f.getId()), used, filter, pathId);
            }
          }
        }
        if(segment.getDynamicMappingInfo() != null && segment.getDynamicMappingInfo().getItems() != null ) {
          this.process(segment.getDynamicMappingInfo() , used, filter);
        }
  }


  /**
   * @param dynamicMappingInfo
   * @param used
   * @param filter
   * @throws EntityNotFound 
   */
  @Override
  public void process(DynamicMappingInfo dynamicMappingInfo, SegmentDependencies used,
      DependencyFilter filter) throws EntityNotFound {

    for (DynamicMappingItem item : dynamicMappingInfo.getItems()) {
      if(item.getDatatypeId() != null) {
        datatypeDependencyService.visit(item.getDatatypeId(), used.getDatatypes(), used, filter, new ResourceBindingProcessor() , null);
      }
    }
  }


  /**
   * @param slicing
   * @param used
   * @throws EntityNotFound 
   */
  private void processSlicing(Slicing slicing, SegmentDependencies used, DependencyFilter filter, String path) throws EntityNotFound {

    if(slicing instanceof ConditionalSlicing ) {  
      this.processSlices(((ConditionalSlicing) slicing).getSlices(), used, filter, path);
    }else if (slicing instanceof OrderedSlicing){
      this.processSlices(((OrderedSlicing) slicing).getSlices(), used, filter, path);
    }
  }




  private <T extends Slice> void processSlices(List<T> slices, SegmentDependencies used, DependencyFilter filter, String path) throws EntityNotFound {
    if(slices != null) {
      for ( T slice: slices) {
        if(slice.getFlavorId() != null) {
          datatypeDependencyService.visit(slice.getFlavorId(), used.getDatatypes(), used, filter, new ResourceBindingProcessor() , null);
        }
      }
    }
  }

  @Override
  public void visit(String id, Map<String, Segment> existing, SegmentDependencies used,
      DependencyFilter filter, ResourceBindingProcessor rb, String path) throws EntityNotFound {

      Segment s = existing.containsKey(id)? existing.get(id):  segmentService.findById(id);

      if(s != null) {
        existing.put(s.getId(), s);
        rb.addChild(s.getBinding(), path);
        this.process(s, used , filter, rb,  path);
      } else throw new EntityNotFound(id);
    
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

  @Override
  public Set<RelationShip> collectDependencies(Segment elm) {

    Set<RelationShip> used = new HashSet<RelationShip>();
    HashMap<String, Usage> usageMap = new HashMap<String, Usage>();

    for (Field f : elm.getChildren()) {
      if (f.getRef() != null && f.getRef().getId() != null) {

        RelationShip rel = new RelationShip(new ReferenceIndentifier(f.getRef().getId(), Type.DATATYPE),
            new ReferenceIndentifier(elm.getId(), Type.SEGMENT),

            new ReferenceLocation(Type.FIELD, f.getPosition() + "", f.getName()));
        rel.setUsage(f.getUsage());
        usageMap.put(f.getId(), f.getUsage());
        used.add(rel);
      }
    }
    if (elm.getDynamicMappingInfo() != null) {
      collectDynamicMappingDependencies(elm.getId(), elm.getDynamicMappingInfo(), used);
    }
    if (elm.getBinding() != null) {
      Set<RelationShip> bindingDependencies = bindingService.collectDependencies(
          new ReferenceIndentifier(elm.getId(), Type.SEGMENT), elm.getBinding(), usageMap);
      used.addAll(bindingDependencies);

    }
    if(elm.getSlicings() != null ) {
      Set<RelationShip> slicingDependencies = slicingService.collectDependencies(
          new ReferenceIndentifier(elm.getId(), Type.SEGMENT), elm.getSlicings(), Type.DATATYPE);
      used.addAll(slicingDependencies);  
    }
     return used;
  }
  
  private void collectDynamicMappingDependencies(String id, DynamicMappingInfo dynamicMappingInfo,
      Set<RelationShip> used) {
    if (dynamicMappingInfo.getItems() != null) {
      for (DynamicMappingItem item : dynamicMappingInfo.getItems()) {
        if (item.getDatatypeId() != null) {
          RelationShip rel = new RelationShip(new ReferenceIndentifier(item.getDatatypeId(), Type.DATATYPE),
              new ReferenceIndentifier(id, Type.SEGMENT),

              new ReferenceLocation(Type.DYNAMICMAPPING, "Dynamic Mapping", null));
          used.add(rel);
        }
      }
    }
  }
}
