package gov.nist.hit.hl7.igamt.coconstraints.service.impl;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.repository.CoConstraintGroupRepository;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
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
    public CoConstraintGroup findById(String id) throws CoConstraintGroupNotFoundException {
        return this.coConstraintGroupRepository.findById(id).orElseThrow(() -> {
            return new CoConstraintGroupNotFoundException(id);
        });
    }

    @Override
    public List<CoConstraintGroup> findByBaseSegmentAndDocumentIdAndUsername(String baseSegment, String documentId, String username) {
        return this.coConstraintGroupRepository.findByBaseSegmentAndDocumentIdAndUsername(baseSegment, documentId, username);
    }

    @Override
    public CoConstraintGroup saveCoConstraintGroup(CoConstraintGroup group) {
        return this.coConstraintGroupRepository.save(group);
    }

    @Override
    public CoConstraintTable resolveRefAndMerge(CoConstraintTable table) {
        CoConstraintHeaders headers = new CoConstraintHeaders();
        this.mergeHeaders(headers, table.getHeaders());

        List<CoConstraintGroupBinding> bindings = table.getGroups().stream().map((binding) -> {
            if(binding instanceof CoConstraintGroupBindingContained) {
                return (CoConstraintGroupBindingContained) binding;
            } else {
                CoConstraintGroupBindingContained contained = new CoConstraintGroupBindingContained();
                contained.setRequirement(binding.getRequirement());

                try {
                    CoConstraintGroup group = this.findById(((CoConstraintGroupBindingRef) binding).getRefId());
                    contained.setName(group.getName());
                    contained.setCoConstraints(group.getCoConstraints());
                    this.mergeHeaders(headers, group.getHeaders());

                    return contained;
                } catch (CoConstraintGroupNotFoundException e) {
                    e.printStackTrace();
                    return null;
                }
            }
        }).filter((elm) -> {
            return elm != null;
        }).collect(Collectors.toList());

        CoConstraintTable clone = new CoConstraintTable();
        clone.setBaseSegment(table.getBaseSegment());
        clone.setId(table.getId());
        clone.setCoConstraints(table.getCoConstraints());
        clone.setTableType(table.getTableType());
        clone.setHeaders(headers);
        clone.setGroups(bindings);

        return clone;
    }

    public void mergeHeaders(CoConstraintHeaders origin, CoConstraintHeaders target) {
        this.mergeHeader(origin.getSelectors(), target.getSelectors());
        this.mergeHeader(origin.getConstraints(), target.getConstraints());
        this.mergeHeader(origin.getNarratives(), target.getNarratives());

    }

    public void mergeHeader(List<CoConstraintHeader> origin, List<CoConstraintHeader>  target) {
        target.forEach((header) -> {
            boolean exists = origin.stream().filter((elm) -> {
                return elm.getKey().equals(header.getKey());
            }).findAny().isPresent();

            if(!exists) {
                origin.add(header);
            }
        });
    }



    @Override
    public CoConstraintGroup clone(String id, Map<String, String> datatypes, Map<String, String> valueSets) {
        CoConstraintGroup group = this.coConstraintGroupRepository.findById(id).get();
        if(group != null) {
            CoConstraintGroup clone = group.clone();
            clone.getCoConstraints().forEach(cc -> {
                cc.getCells().values().stream().forEach(cell -> {
                    this.cellIdSubstitution(cell.getType(), cell, datatypes, valueSets);
                });
            });
            return clone;
        }
        return null;
    }

    void datatypeCellIdSubstitution(DatatypeCell cell, Map<String, String> datatypes) {

    }

    void valueSetCellIdSubstitution(ValueSetCell cell, Map<String, String> valueSets) {
        cell.getBindings().forEach(binding -> {
            binding.setValueSets(binding.getValueSets().stream().map(vs -> valueSets.get(vs)).collect(Collectors.toList()));
        });
    }

    void cellIdSubstitution(ColumnType type, CoConstraintCell cell,  Map<String, String> datatypes, Map<String, String> valueSets) {
        if(type.equals(ColumnType.DATATYPE)) {
            this.datatypeCellIdSubstitution((DatatypeCell) cell, datatypes);
        } else if(type.equals(ColumnType.VALUESET)) {
            this.valueSetCellIdSubstitution((ValueSetCell) cell, valueSets);
        } else if(type.equals(ColumnType.VARIES)) {
            VariesCell vc = (VariesCell) cell;
            if(vc.getCellType() != null && vc.getCellValue() != null) {
                this.cellIdSubstitution(vc.getCellType(), vc.getCellValue(), datatypes, valueSets);
            }
        }
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

        if(obx_2 != null && obx_3 != null && obx_5 != null) {
            group.getHeaders().getSelectors().add(this.OBXHeader(obx_3, ColumnType.CODE, false));
            group.getHeaders().getConstraints().add(this.OBXHeader(obx_2, ColumnType.DATATYPE, false));
            group.getHeaders().getConstraints().add(this.OBXHeader(obx_5, ColumnType.VARIES, true));
        }
    }

    public DataElementHeader OBXHeader(Field field, ColumnType type, boolean cardinalityHeader) {
        DataElementHeader obx_header = new DataElementHeader();
        Datatype obx_dt = this.datatypeService.findById(field.getRef().getId());

        obx_header.setName("OBX-"+field.getPosition());
        obx_header.setCardinality(cardinalityHeader);
        obx_header.setColumnType(type);
        obx_header.setKey(field.getId());

        CoConstraintCardinality cardinality = new CoConstraintCardinality();
        cardinality.setMin(field.getMin());
        cardinality.setMax(field.getMax());

        DataElementHeaderInfo obx_info = new DataElementHeaderInfo();
        obx_info.setType(Type.FIELD);
        obx_info.setLocation(field.getPosition());
        obx_info.setParent("OBX");
        obx_info.setDatatype(obx_dt.getName());
        obx_info.setVersion(obx_dt.getDomainInfo().getVersion());
        obx_info.setCardinality(cardinality);
        obx_header.setElementInfo(obx_info);

        return obx_header;
    }

}