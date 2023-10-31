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

import java.util.*;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slice;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.segment.wrappers.SegmentDependencies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.service.CommonFilteringService;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.wrappers.ConformanceProfileDependencies;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

@Service
public class ConformanceProfileDependencyServiceImpl implements ConformanceProfileDependencyService {


  @Autowired
  SegmentDependencyService segmentDependencyService;

  @Autowired
  DatatypeDependencyService datatypeDependencyService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  CoConstraintDependencyService coConstraintDependencyService;

  @Autowired
  CoConstraintService coConstraintService;

  @Autowired
  CommonFilteringService commonFilteringService;
  
  @Autowired
  SlicingService slicingService;
  
  @Autowired
  BindingService bindingService;
  


  @Override
  public void updateDependencies(ConformanceProfile elm, HashMap<RealKey, String> newKeys) {
    
    processAndSubstitute(elm, newKeys);
    if (elm.getBinding() != null) {
      this.bindingService.substitute(elm.getBinding(), newKeys);
    }
    if(elm.getSlicings() != null) {
      this.slicingService.updateSlicing(elm.getSlicings(), newKeys, Type.SEGMENT);
    }
    if (elm.getCoConstraintsBindings() != null) {
      for (CoConstraintBinding binding : elm.getCoConstraintsBindings()) {
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
  }



  @Override
  public ConformanceProfileDependencies getDependencies(ConformanceProfile resource, DependencyFilter filter) throws EntityNotFound {
    ConformanceProfileDependencies conformanceProfileDependencies = new ConformanceProfileDependencies();

    this.process(resource, conformanceProfileDependencies, filter);

    return conformanceProfileDependencies;
  }

  @Override
  public ConformanceProfileDependencies process(ConformanceProfile resource, ConformanceProfileDependencies conformanceProfileDependencies, DependencyFilter filter) throws EntityNotFound {
    ResourceBindingProcessor rb = new ResourceBindingProcessor(resource.getBinding());
    Map<String, Slicing> slicingMap =  resource.getSlicings() != null ?  resource.getSlicings().stream().collect(
            Collectors.toMap(Slicing::getPath, x -> x)) : new HashMap<>();

    for(MsgStructElement segOrgroup:  resource.getChildren()) {
      if(commonFilteringService.allow(filter.getUsageFilter(), segOrgroup)) {
        if (segOrgroup instanceof SegmentRef) {

          SegmentRef ref = (SegmentRef) segOrgroup;
          if (ref.getRef() != null && ref.getRef().getId() != null ) {
            this.segmentDependencyService.visit(ref.getRef().getId(), conformanceProfileDependencies.getSegments(), conformanceProfileDependencies, filter, rb, segOrgroup.getId());
          }
        } else if (segOrgroup instanceof Group) {

          Group g = (Group) segOrgroup;
          for (MsgStructElement child : g.getChildren()) {
            processSegmentorGroup(child, conformanceProfileDependencies, filter, rb, g.getId());
          }
        }
        if(slicingMap.containsKey(segOrgroup.getId())) {
          this.processSlicing(slicingMap.get(segOrgroup.getId()), conformanceProfileDependencies, filter);
        }
      }
    }
    if(resource.getCoConstraintsBindings() != null) {      
      this.processCoConstraintsBinding(resource.getCoConstraintsBindings(),conformanceProfileDependencies, filter);
    }
    
    return conformanceProfileDependencies;
  }

  private void processSlicing(Slicing slicing, SegmentDependencies used, DependencyFilter filter) throws EntityNotFound {
    if(slicing instanceof ConditionalSlicing) {
      this.processSlices(((ConditionalSlicing) slicing).getSlices(), used, filter);
    } else if (slicing instanceof OrderedSlicing){
      this.processSlices(((OrderedSlicing) slicing).getSlices(), used, filter);
    }
  }

  private <T extends Slice> void processSlices(List<T> slices, SegmentDependencies used, DependencyFilter filter) throws EntityNotFound {
    if(slices != null) {
      for ( T slice: slices) {
        if(slice.getFlavorId() != null) {
          datatypeDependencyService.visit(slice.getFlavorId(), used.getDatatypes(), used, filter, new ResourceBindingProcessor() , null, new HashSet<>());
        }
      }
    }
  }

  @Override
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

  public void processSegmentorGroup(MsgStructElement segOrgroup,  ConformanceProfileDependencies used, DependencyFilter filter, ResourceBindingProcessor rb, String parent) throws EntityNotFound {
    if(commonFilteringService.allow(filter.getUsageFilter(), segOrgroup)) {
      if (segOrgroup instanceof SegmentRef) {
        SegmentRef ref = (SegmentRef) segOrgroup;
        if (ref.getRef() != null && ref.getRef().getId() != null ) {
          this.segmentDependencyService.visit(ref.getRef().getId(), used.getSegments(), used, filter, rb, parent+'-'+ segOrgroup.getId());
        }
      } else if (segOrgroup instanceof Group) {
        Group g = (Group) segOrgroup;
        for (MsgStructElement child : g.getChildren()) {
          processSegmentorGroup(child, used, filter, rb, parent+'-'+ child.getId() );
        }
      }
    }
  }

  public void process(
      CoConstraintTable value, ConformanceProfileDependencies used, DependencyFilter filter) throws EntityNotFound{
    if(value.getGroups() !=null) {
      for(CoConstraintGroupBinding groupBinding : value.getGroups()) {
        if(groupBinding instanceof CoConstraintGroupBindingContained) {
          CoConstraintGroupBindingContained  contained = (CoConstraintGroupBindingContained)(groupBinding);
          if(contained.getCoConstraints() !=null) {
            contained.getCoConstraints().stream().forEach( cc -> {
              try {
                this.coConstraintDependencyService.process(cc, used, filter);
              } catch (EntityNotFound e) {
                e.printStackTrace();
              }
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
        try {
          this.coConstraintDependencyService.process(cc, used, filter);
        } catch (EntityNotFound e) {
          e.printStackTrace();
        }
      });
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
  
  @Override
  public Set<RelationShip> collectDependencies(ConformanceProfile cp) {
    Set<RelationShip> used = new HashSet<RelationShip>();
    HashMap<String, Usage> usageMap = new HashMap<String, Usage>();
    for (MsgStructElement segOrgroup : cp.getChildren()) {
      if (segOrgroup instanceof SegmentRef) {
        usageMap.put(segOrgroup.getId(), segOrgroup.getUsage());
        usageMap.put(segOrgroup.getId(), segOrgroup.getUsage());
        SegmentRef ref = (SegmentRef) segOrgroup;

        if (ref.getRef() != null && ref.getRef().getId() != null) {
          RelationShip rel = new RelationShip(new ReferenceIndentifier(ref.getRef().getId(), Type.SEGMENT),
              new ReferenceIndentifier(cp.getId(), Type.CONFORMANCEPROFILE),
              new ReferenceLocation(Type.CONFORMANCEPROFILE, ref.getPosition() + "", ref.getName()));
          rel.setUsage(ref.getUsage());
          used.add(rel);
        }

      } else {
        processSegmentorGroup(cp.getId(), segOrgroup, used, "");
      }
    }
    if (cp.getBinding() != null) {

      Set<RelationShip> bindingDependencies = bindingService.collectDependencies(
          new ReferenceIndentifier(cp.getId(), Type.CONFORMANCEPROFILE), cp.getBinding(), usageMap);
      used.addAll(bindingDependencies);
    }
    if (cp.getCoConstraintsBindings() != null) {

      Set<RelationShip> CoConstraintsDependencies = coConstraintDependencyService.collectDependencies(
          new ReferenceIndentifier(cp.getId(), Type.CONFORMANCEPROFILE), cp.getCoConstraintsBindings());

      used.addAll(CoConstraintsDependencies);
    }

    if(cp.getSlicings() != null ) {
      Set<RelationShip> slicingDependencies = this.slicingService.collectDependencies(
          new ReferenceIndentifier(cp.getId(), Type.CONFORMANCEPROFILE), cp.getSlicings(), Type.SEGMENT);
      used.addAll(slicingDependencies);  
    }
    return used;

  }


  private void processSegmentorGroup(String profileId, MsgStructElement segOrgroup, Set<RelationShip> used,
      String path) {
    // TODO Auto-generated method stub
    if (segOrgroup instanceof SegmentRef) {
      SegmentRef ref = (SegmentRef) segOrgroup;
      if (ref.getRef() != null && ref.getRef().getId() != null) {

        RelationShip rel = new RelationShip(new ReferenceIndentifier(ref.getRef().getId(), Type.SEGMENT),
            new ReferenceIndentifier(profileId, Type.CONFORMANCEPROFILE),

            new ReferenceLocation(Type.GROUP, path + "." + ref.getPosition(), ref.getName()));
        rel.setUsage(ref.getUsage());
        used.add(rel);
      }
    } else if (segOrgroup instanceof Group) {
      Group g = (Group) segOrgroup;
      path += g.getName();
      for (MsgStructElement child : g.getChildren()) {
        processSegmentorGroup(profileId, child, used, path);
      }
    }
  }
  
  
}
