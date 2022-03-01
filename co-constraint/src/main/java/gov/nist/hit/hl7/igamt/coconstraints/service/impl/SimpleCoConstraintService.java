package gov.nist.hit.hl7.igamt.coconstraints.service.impl;

import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.repository.CoConstraintGroupRepository;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SimpleCoConstraintService implements CoConstraintService {

  @Autowired
  private CoConstraintGroupRepository coConstraintGroupRepository;
  @Autowired
  private SegmentService segmentService;
  @Autowired
  private DatatypeService datatypeService;

  @Override
  public CoConstraintGroup findById(String id) throws EntityNotFound {
    return this.coConstraintGroupRepository.findById(id).orElseThrow(() -> new EntityNotFound(id));
  }

  @Override
  public void delete(CoConstraintGroup ccG) {
    this.coConstraintGroupRepository.delete(ccG);
  }

  @Override
  public List<CoConstraintGroup> findByBaseSegmentAndDocumentIdAndUsername(String baseSegment, String documentId, String username) {
    Segment target = this.segmentService.findById(baseSegment);
    if(target != null) {
      List<CoConstraintGroup> igGroups = this.coConstraintGroupRepository.findByDocumentIdAndUsername(documentId, username);
      return igGroups.stream().filter((group) -> {
        Segment groupTarget = this.segmentService.findById(group.getBaseSegment());
        return groupTarget != null && groupTarget.getName().equals(target.getName());
      }).collect(Collectors.toList());
    } else {
      return Collections.emptyList();
    }
  }

  @Override
  public CoConstraintGroup saveCoConstraintGroup(CoConstraintGroup group) {
    return this.coConstraintGroupRepository.save(group);
  }

  @Override
  public CoConstraintTable resolveRefAndMerge(CoConstraintTable table) {
    CoConstraintHeaders headers = table.getHeaders();

    List<CoConstraintGroupBinding> bindings = new ArrayList<>();
    for(CoConstraintGroupBinding binding : table.getGroups()) {
      if (binding instanceof CoConstraintGroupBindingContained) {
        bindings.add(binding);
      } else {
        try {
          CoConstraintGroupBindingContained contained = new CoConstraintGroupBindingContained();
          contained.setRequirement(binding.getRequirement());
          CoConstraintGroup group = this.findById(((CoConstraintGroupBindingRef) binding).getRefId());
          contained.setName(group.getName());
          contained.setId(binding.getId());
          contained.setCoConstraints(group.getCoConstraints());
          this.mergeHeaders(headers, group.getHeaders(), ((CoConstraintGroupBindingRef) binding));
          bindings.add(contained);
        } catch (EntityNotFound e) {
          e.printStackTrace();
        }
      }
    }

    CoConstraintTable clone = new CoConstraintTable();
    clone.setId(table.getId());
    clone.setCoConstraints(table.getCoConstraints());
    clone.setTableType(table.getTableType());
    clone.setHeaders(headers);
    clone.setGroups(bindings);

    return clone;
  }

  public void mergeHeaders(CoConstraintHeaders origin, CoConstraintHeaders target, CoConstraintGroupBindingRef ref) {
    this.mergeHeader(origin.getSelectors(), target.getSelectors(), ref.getExcludeIfColumns());
    this.mergeHeader(origin.getConstraints(), target.getConstraints(), ref.getExcludeThenColumns());
    this.mergeHeader(origin.getNarratives(), target.getNarratives(), ref.getExcludeNarrativeColumns());
    if(origin.getGrouper() == null) {
      origin.setGrouper(target.getGrouper());
    }
  }

  public void mergeHeader(List<CoConstraintHeader> origin, List<CoConstraintHeader>  target, Set<String> exclude) {
    target.forEach((header) -> {
      boolean exists = origin.stream().anyMatch((elm) -> elm.getKey().equals(header.getKey()));

      if(!exists && (exclude == null || !exclude.contains(header.getKey()))) {
        origin.add(header);
      }
    });
  }



  void valueSetCellIdSubstitution(ValueSetCell cell, Map<String, String> valueSets) {
    cell.getBindings().forEach(binding -> {
      binding.setValueSets(binding.getValueSets().stream().map(valueSets::get).collect(Collectors.toList()));
    });
  }


  @Override
  public CoConstraintGroup createCoConstraintGroupPrototype(String id) throws SegmentNotFoundException {
    Segment segment = this.segmentService.findById(id);

    if(segment != null) {
      CoConstraintGroup group = new CoConstraintGroup();
      group.setBaseSegment(segment.getId());
      DomainInfo di = new DomainInfo();
      di.setScope(Scope.USER);
      group.setDomainInfo(di);
      if(segment.getName().equals("OBX")) {
        this.createOBXCoConstraintGroup(segment, group);
      }
      return group;
    } else {
      throw new SegmentNotFoundException(id);
    }
  }

  @Override
  public Link createIgLink(CoConstraintGroup group, int position, String username) {
    Link link = new Link();
    link.setId(group.getId());
    link.setType(Type.COCONSTRAINTGROUP);
    link.setDomainInfo(group.getDomainInfo());
    link.setPosition(position);
    link.setUsername(username);
    return link;
  }

  public void createOBXCoConstraintGroup(Segment obx, CoConstraintGroup group) {
    Field obx_2 = obx.getChildren().stream().filter(field -> field.getPosition() == 2).findFirst().get();
    Field obx_3 = obx.getChildren().stream().filter(field -> field.getPosition() == 3).findFirst().get();
    Field obx_5 = obx.getChildren().stream().filter(field -> field.getPosition() == 5).findFirst().get();
    Field obx_4 = obx.getChildren().stream().filter(field -> field.getPosition() == 4).findFirst().get();

    group.getHeaders().getSelectors().add(this.OBXHeader(obx_3, ColumnType.CODE, false));
    group.getHeaders().getConstraints().add(this.OBXHeader(obx_2, ColumnType.DATATYPE, false));
    group.getHeaders().getConstraints().add(this.OBXHeader(obx_5, ColumnType.VARIES, true));
    group.getHeaders().setGrouper(this.OBXGrouper(obx_4));
  }

  public DataElementHeader OBXHeader(Field field, ColumnType type, boolean cardinalityHeader) {
    DataElementHeader obx_header = new DataElementHeader();
    obx_header.setColumnType(type);
    obx_header.setKey(field.getId());
    return obx_header;
  }

  public CoConstraintGrouper OBXGrouper(Field field) {
    CoConstraintGrouper obx_grouper = new CoConstraintGrouper();
    Datatype obx_dt = this.datatypeService.findById(field.getRef().getId());

    if(!(obx_dt instanceof ComplexDatatype) || obx_dt.getFixedName().equals("OG")) {
      obx_grouper.setPathId(field.getId());
      return obx_grouper;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService#collectDependencies(gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier, java.util.List)
   */
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
    // TODO Auto-generated method stub
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

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService#findByIdIn(java.util.Set)
   */
  @Override
  public List<CoConstraintGroup> findByIdIn(Set<String> ids) {
    // TODO Auto-generated method stub
    return coConstraintGroupRepository.findByIdIn(ids);
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

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService#clone(java.lang.String, java.util.HashMap, gov.nist.hit.hl7.igamt.common.base.domain.Link, java.lang.String, gov.nist.hit.hl7.igamt.common.base.domain.Scope)
   */
  @Override
  public Link clone(String id, HashMap<RealKey, String> newKeys, Link l, String username,
      Scope scope, String targetId, CloneMode cloneMode) {
    // TODO Auto-generated method stub
    Optional<CoConstraintGroup> group = this.coConstraintGroupRepository.findById(l.getId());
    if(group.isPresent()) {
      CoConstraintGroup elm = group.get().clone();
      elm.setDocumentId(targetId);
      elm.getDomainInfo().setScope(scope);
      elm.setOrigin(l.getId());
      elm.setUsername(username);
      elm.setId(id);
      elm.setDerived(cloneMode.equals(CloneMode.DERIVE));
      Link newLink = new Link(elm);

      updateDependencies(elm, newKeys);
      this.coConstraintGroupRepository.save(elm);
      return newLink;
    } else {
      return null;
    }
  }

  /**
   * @param elm
   * @param newKeys
   * @param username
   */
  @Override
  public void updateDependencies(CoConstraintGroup elm, HashMap<RealKey, String> newKeys) {
    RealKey segmentKey= new RealKey(elm.getBaseSegment(), Type.SEGMENT);
    if(elm.getBaseSegment() !=null && newKeys.containsKey(segmentKey)) {
      elm.setBaseSegment(newKeys.get(segmentKey));
    }
    if(elm.getCoConstraints() !=null) {
      for(CoConstraint cc: elm.getCoConstraints() ) {
        // cc.setCloned(cloned || cc.isCloned());
        updateDependencies(cc, newKeys);
      }
    }


  }
  
  public void updateDependencies(CoConstraint coconstraint, HashMap<RealKey, String> newKeys) {
    if(coconstraint.getCells() !=null && coconstraint.getCells().values() !=null) {
      coconstraint.getCells().values().stream().forEach(cell -> {
        this.updateDepenedencies( cell, newKeys);
      }); 
    }
  }

  private void updateDepenedencies(CoConstraintCell cell,
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
  public void updateDepenedencies(
      CoConstraintTable value, HashMap<RealKey, String> newKeys) {
    if(value.getGroups() !=null) {
      for(CoConstraintGroupBinding groupBinding : value.getGroups()) {
        if(groupBinding instanceof CoConstraintGroupBindingContained) {
          CoConstraintGroupBindingContained  contained = (CoConstraintGroupBindingContained)(groupBinding);
          if(contained.getCoConstraints() !=null) {
            contained.getCoConstraints().stream().forEach( cc -> {
             // cc.setCloned(cloned || cc.isCloned());
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
  
  
  @Override
  public void updateCloneTag(
      CoConstraintTable value, boolean cloned) {
    // TODO Auto-generated method stub
    if(value.getGroups() !=null) {
      for(CoConstraintGroupBinding groupBinding : value.getGroups()) {
        if(groupBinding instanceof CoConstraintGroupBindingContained) {
          CoConstraintGroupBindingContained  contained = (CoConstraintGroupBindingContained)(groupBinding);
          if(contained.getCoConstraints() !=null) {
            contained.getCoConstraints().stream().forEach( cc -> {
              cc.setCloned(cloned || cc.isCloned());
            });
          }
        }
      }
    };
    if(value.getCoConstraints() !=null) {
      value.getCoConstraints().stream().forEach( cc -> {
       cc.setCloned(cloned || cc.isCloned());
      });
    }
  }


  @Override
  public List<CoConstraintGroup> saveAll(Set<CoConstraintGroup> coConstraintGroups) {
    return this.coConstraintGroupRepository.saveAll(coConstraintGroups);
  }

}
