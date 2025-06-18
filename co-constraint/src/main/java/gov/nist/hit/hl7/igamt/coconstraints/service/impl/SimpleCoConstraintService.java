package gov.nist.hit.hl7.igamt.coconstraints.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.repository.CoConstraintGroupRepository;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
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
import java.util.stream.Stream;

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
  public List<CoConstraintGroup> findDocumentCoConstraintGroupsSegmentCompatible(String segmentId, DocumentType type, String documentId) {
    Segment target = this.segmentService.findById(segmentId);
    if(target != null) {
      List<CoConstraintGroup> igGroups = this.coConstraintGroupRepository.findByDocumentInfoDocumentIdAndDocumentInfoType(documentId, type);
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
  public boolean codeCellIsEmpty(CodeCell cell) {
    return cell == null || Strings.isNullOrEmpty(cell.getCode()) && Strings.isNullOrEmpty(cell.getCodeSystem()) && (cell.getLocations() == null || cell.getLocations().isEmpty());
  }

  @Override
  public boolean constantCellIsEmpty(ValueCell cell) {
    return cell == null || Strings.isNullOrEmpty(cell.getValue());
  }

  @Override
  public boolean datatypeCellIsEmpty(DatatypeCell cell) {
    return cell == null || (Strings.isNullOrEmpty(cell.getValue()) && Strings.isNullOrEmpty(cell.getDatatypeId()));
  }

  @Override
  public boolean valueSetCellIsEmpty(ValueSetCell cell) {
    return cell == null || (cell.getBindings() == null || cell.getBindings().isEmpty());
  }

  @Override
  public boolean variesCellIsEmpty(VariesCell variesCell) {
    return variesCell == null || this.cellIsEmpty(variesCell.getCellValue());
  }

  @Override
  public boolean anyCellIsEmpty(AnyCell anyCell) {
    return anyCell == null || this.cellIsEmpty(anyCell.getCellValue());
  }

  @Override
  public boolean cellIsEmpty(CoConstraintCell cell) {
    if(cell == null)
      return true;

    switch (cell.getType()) {
      case CODE:
        return this.codeCellIsEmpty((CodeCell) cell);
      case VALUE:
        return this.constantCellIsEmpty((ValueCell) cell);
      case VARIES:
        return this.variesCellIsEmpty((VariesCell) cell);
      case DATATYPE:
        return this.datatypeCellIsEmpty((DatatypeCell) cell);
      case VALUESET:
        return this.valueSetCellIsEmpty((ValueSetCell) cell);
      case ANY:
        return this.anyCellIsEmpty((AnyCell) cell);
    }
    return true;
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

  @Override
  public List<CoConstraintGroup> findByIdIn(Set<String> ids) {
    return coConstraintGroupRepository.findByIdIn(ids);
  }
  
  @Override
  public void updateCloneTag(
      CoConstraintTable value, boolean cloned) {
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

  @Override
  public Set<String> getValueSetIds(List<CoConstraintBinding> bindings) {
    Set<String> valueSetIds = new HashSet<>();
    for(CoConstraintBinding binding: bindings) {
      for(CoConstraintBindingSegment bindingSegment: binding.getBindings()) {
        for(CoConstraintTableConditionalBinding tableConditionalBinding: bindingSegment.getTables()) {
          CoConstraintTable table = this.resolveRefAndMerge(tableConditionalBinding.getValue());
          List<CoConstraint> coConstraintList = Stream.concat(
                  table.getCoConstraints().stream(),
                  table.getGroups().stream()
                          .filter((group) ->
                            group instanceof CoConstraintGroupBindingContained
                          )
                          .flatMap((group) ->
                            ((CoConstraintGroupBindingContained) group).getCoConstraints().stream()
                          )
          ).collect(Collectors.toList());
          for(CoConstraint cc: coConstraintList) {
            for(CoConstraintCell cell : cc.getCells().values()) {
              if(!this.cellIsEmpty(cell)) {
                if(cell instanceof ValueSetCell) {
                  ((ValueSetCell) cell).getBindings().forEach((vsBinding) -> {
                    valueSetIds.addAll(vsBinding.getValueSets());
                  });
                } else if(cell instanceof VariesCell && ((VariesCell) cell).getCellValue() instanceof ValueSetCell) {
                  ((ValueSetCell) ((VariesCell) cell).getCellValue()).getBindings().forEach((vsBinding) -> {
                    valueSetIds.addAll(vsBinding.getValueSets());
                  });
                } else if(cell instanceof AnyCell && ((AnyCell) cell).getCellValue() instanceof ValueSetCell) {
                  ((ValueSetCell) ((AnyCell) cell).getCellValue()).getBindings().forEach((vsBinding) -> {
                    valueSetIds.addAll(vsBinding.getValueSets());
                  });
                }
              }
            }
          }
        }
      }
    }
    return valueSetIds;
  }
}
