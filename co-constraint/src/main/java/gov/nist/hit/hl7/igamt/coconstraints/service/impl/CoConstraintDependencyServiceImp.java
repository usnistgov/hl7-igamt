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

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBindingContained;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBindingRef;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.DatatypeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueSetCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.VariesCell;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintDependencyService;
import gov.nist.hit.hl7.igamt.coconstraints.wrappers.CoConstraintsDependencies;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatype.wrappers.DatatypeDependencies;
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
  
  @Autowired
  BindingService bindingService;


  @Override
  public void updateDepenedencies(
      CoConstraintTable value, HashMap<RealKey, String> newKeys) {
    if(value.getGroups() !=null) {
      for(CoConstraintGroupBinding groupBinding : value.getGroups()) {
        if(groupBinding instanceof CoConstraintGroupBindingContained) {
          CoConstraintGroupBindingContained  contained = (CoConstraintGroupBindingContained)(groupBinding);
          if(contained.getCoConstraints() !=null) {
            contained.getCoConstraints().stream().forEach( cc -> {
              this.updateDependencies(cc, newKeys);
            });
          }
        }else if(groupBinding instanceof CoConstraintGroupBindingRef) {
          CoConstraintGroupBindingRef ref = (CoConstraintGroupBindingRef)groupBinding;
          RealKey groupKey = new RealKey(ref.getRefId(), Type.COCONSTRAINTGROUP);
          if(newKeys.containsKey(groupKey)) {
            ref.setRefId(newKeys.get(groupKey));
          }
        }
      }
    };
    if(value.getCoConstraints() !=null) {
      value.getCoConstraints().stream().forEach( cc -> {
        this.updateDependencies(cc, newKeys);
      });
    }
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
  public void process(CoConstraintGroup ccGroup, CoConstraintsDependencies used,  DependencyFilter filter ) throws EntityNotFound {
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
   * @throws EntityNotFound 
   */
  @Override
  public void process(CoConstraint cc, CoConstraintsDependencies used, DependencyFilter filter) throws EntityNotFound {

    if(cc.getCells()!=null) {
      for(Map.Entry<String, CoConstraintCell> entry : cc.getCells().entrySet()){
        this.process(entry.getValue(), used, filter );
      }
    }
  }
  @Override
  public void  process(CoConstraintCell cell,
      DatatypeDependencies used, DependencyFilter filter) throws EntityNotFound {

    if(cell instanceof ValueSetCell) {
      ValueSetCell vsCell= (ValueSetCell)cell;
      if(vsCell.getBindings() !=null) {
        bindingService.processValueSetBinding(vsCell.getBindings().stream().collect(Collectors.toSet()), used.getValuesets(), filter.getExcluded());  

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
  
  @Override
  public void updateDependencies(CoConstraintGroup elm, HashMap<RealKey, String> newKeys) {
    RealKey segmentKey= new RealKey(elm.getBaseSegment(), Type.SEGMENT);
    if(elm.getBaseSegment() !=null && newKeys.containsKey(segmentKey)) {
      elm.setBaseSegment(newKeys.get(segmentKey));
    }
    if(elm.getCoConstraints() !=null) {
      for(CoConstraint cc: elm.getCoConstraints() ) {
        updateDependencies(cc, newKeys);
      }
    }
  }

  private void updateDependencies(CoConstraint coconstraint, HashMap<RealKey, String> newKeys) {
    if(coconstraint.getCells() !=null && coconstraint.getCells().values() !=null) {
      coconstraint.getCells().values().stream().forEach(cell -> {
        this.updateDepenedencies( cell, newKeys);
      }); 
    }
  }
  @Override
  public void updateDepenedencies(CoConstraintCell cell,
      HashMap<RealKey, String> newKeys) {
    if(cell instanceof ValueSetCell) {
      ValueSetCell vsCell= (ValueSetCell)cell;
      if(vsCell.getBindings() !=null) {        
        for(ValuesetBinding vsb : vsCell.getBindings()) {
          if(vsb.getValueSets() !=null ) {
            vsb.setValueSets(vsb.getValueSets().stream().map(vs -> {
              RealKey vsKey = new RealKey(vs, Type.VALUESET);
              if(newKeys.containsKey(vsKey)) {
                return newKeys.get(vsKey);
              }else {
                return vs;
              }
            }).collect(Collectors.toList()));
          }
        }
      }
    }else if(cell instanceof DatatypeCell ) {
      DatatypeCell dtCell= (DatatypeCell)cell; 
      RealKey datatypeKey = new RealKey(dtCell.getDatatypeId(), Type.DATATYPE);
      if(newKeys.containsKey(datatypeKey)) {
        dtCell.setDatatypeId(newKeys.get(datatypeKey));
      }
    }else if(cell instanceof VariesCell) {
      VariesCell vrCell= (VariesCell)cell;
      if(vrCell.getCellValue() !=null) {
        updateDepenedencies(vrCell.getCellValue(), newKeys);
      }
    }   
  }
  @Override
  public Set<RelationShip> collectDependencies(CoConstraintGroup ccGroup) {
    // TODO Auto-generated method stub
    Set<RelationShip> relations= new HashSet<RelationShip>();
    ReferenceIndentifier parent = new ReferenceIndentifier(ccGroup.getId(), Type.COCONSTRAINTGROUP);
    relations.add(new RelationShip
        (new ReferenceIndentifier(ccGroup.getBaseSegment(), Type.SEGMENT), parent, null));
    if(ccGroup.getCoConstraints() !=null) {
      for(CoConstraint cc :ccGroup.getCoConstraints() ) {
        relations.addAll(collectDependencies(cc, parent,null));
      }
    }
    return relations;
  }
  
  private Collection<? extends RelationShip> collectDependencies(CoConstraint cc,
      ReferenceIndentifier parent, String path) {
    HashSet<RelationShip> rel = new HashSet<RelationShip>();

    if(cc.getCells()!=null) {
      for(Map.Entry<String, CoConstraintCell> entry : cc.getCells().entrySet()){
        rel.addAll(collectDependencies(entry.getValue(),parent, path ));
      }
    }
    return rel;
  }

  private Collection<? extends RelationShip> collectDependencies(CoConstraintCell cell,
      ReferenceIndentifier parent, String path) {
    HashSet<RelationShip> rel = new HashSet<RelationShip>();

    if(cell instanceof ValueSetCell) {
      ValueSetCell vsCell= (ValueSetCell)cell;
      if(vsCell.getBindings() !=null) {
        for(ValuesetBinding vsb : vsCell.getBindings()) {
          if(vsb.getValueSets() !=null ) {
            for(String vs : vsb.getValueSets()) {
              rel.add(new RelationShip(new ReferenceIndentifier(vs, Type.VALUESET), parent, new ReferenceLocation(Type.COCONSTRAINTGROUP, path,null )));
            }
          }
        }
      }
    }else if(cell instanceof DatatypeCell ) {
      DatatypeCell dtCell= (DatatypeCell)cell; 
      rel.add(new RelationShip(new ReferenceIndentifier(dtCell.getDatatypeId(), Type.DATATYPE), parent, new ReferenceLocation(Type.COCONSTRAINTGROUP,path, null)));
    }else if(cell instanceof VariesCell) {
      VariesCell vrCell= (VariesCell)cell;
      if(vrCell.getCellValue() !=null) {
        rel.addAll(collectDependencies(vrCell.getCellValue(), parent, path));
      }
    }
    return rel;
  }

  @Override
  public Set<RelationShip> collectDependencies(ReferenceIndentifier parent,
      List<CoConstraintBinding> coConstraintsBindings) {
    // TODO Auto-generated method stub
    HashSet<RelationShip> rel = new HashSet<RelationShip>();

    for(CoConstraintBinding binding:coConstraintsBindings) {
      if(binding.getBindings()!=null) {
        for(CoConstraintBindingSegment segBinding: binding.getBindings()) {
          // TODO Review Line Below :
          //          rel.add(new RelationShip(new ReferenceIndentifier(segBinding.getFlavorId(), Type.SEGMENT), parent, new ReferenceLocation(Type.COCONSTRAINTGROUP,segBinding.getName(), null)));
          if(segBinding.getTables() !=null) {
            for( CoConstraintTableConditionalBinding CoConstraintTableConditionalBinding : segBinding.getTables()) {
              if(CoConstraintTableConditionalBinding.getValue() !=null) {
                rel.addAll(this.collectDependencies(parent, CoConstraintTableConditionalBinding.getValue(),segBinding.getName()));
              }
            }
          }
        }
      }     
    }

    return rel; 

  }

  /**
   * @param parent
   * @param value
   * @return
   */
  private Collection<? extends RelationShip> collectDependencies(
      ReferenceIndentifier parent, CoConstraintTable value, String tableName) {
    // TODO Auto-generated method stub
    HashSet<RelationShip> rel = new HashSet<RelationShip>();
    if(value.getGroups() !=null) {
      for(CoConstraintGroupBinding groupBinding : value.getGroups()) {

        if(groupBinding instanceof CoConstraintGroupBindingContained) {
          CoConstraintGroupBindingContained  coConstraintGroupBindingContained = (CoConstraintGroupBindingContained)(groupBinding);
          rel.addAll(this.collectDependencies(coConstraintGroupBindingContained.getCoConstraints(), parent, tableName+"."+coConstraintGroupBindingContained.getName()));

        }else if(groupBinding instanceof CoConstraintGroupBindingRef) {
          CoConstraintGroupBindingRef ref = (CoConstraintGroupBindingRef)groupBinding;
          ref.getRefId();
          rel.add(new RelationShip(new ReferenceIndentifier(ref.getRefId(), Type.COCONSTRAINTGROUP), parent, new ReferenceLocation(parent.getType(), tableName,"Co-Constraint Table")));
        }
      }
    }
    if(value.getCoConstraints() !=null) {
      rel.addAll(this.collectDependencies(value.getCoConstraints(), parent, tableName));
    }
    return rel;
  }
  
  private Collection<? extends RelationShip> collectDependencies(List<CoConstraint> coConstraints,
      ReferenceIndentifier parent, String path) {
    HashSet<RelationShip> rel = new HashSet<RelationShip>();
    for(CoConstraint cc: coConstraints) {
      rel.addAll(collectDependencies(cc, parent, path));
    }
    return rel;
  }
}
