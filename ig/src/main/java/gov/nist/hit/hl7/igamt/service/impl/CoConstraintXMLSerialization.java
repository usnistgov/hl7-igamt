package gov.nist.hit.hl7.igamt.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Assertion;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import nu.xom.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class CoConstraintXMLSerialization {

    @Autowired
    CoConstraintService coConstraintService;

    @Autowired
    AssertionXMLSerialization assertionXMLSerialization;

    @Autowired
    GeneratePathService generatePathService;

    public String getPathInSegment(String pathId, String segmentId) {
        InstancePath instancePath = generatePathService.getInstancePath(pathId, "*");
        if(instancePath != null) {
            return generatePathService.generatePath(instancePath, segmentId, Level.SEGMENT, null);
        }
        return ".";
    }

    public String getPathInConformanceProfile(String pathId, String cpId) {
        InstancePath instancePath = generatePathService.getInstancePath(pathId, "*");
        if(instancePath != null) {
            return generatePathService.generatePath(instancePath, cpId, Level.CONFORMANCEPROFILE, null);
        }
        return ".";
    }

    public String getPathInGroup(String pathId, String cpId, String groupPathId) {
        InstancePath instancePath = generatePathService.getInstancePath(pathId, "*");
        InstancePath groupInstancePath = generatePathService.getInstancePath(groupPathId, "*");

        if(instancePath != null) {
            return generatePathService.generatePath(instancePath, cpId, Level.GROUP, groupInstancePath);
        }
        return ".";
    }


    public Element serialize(ConformanceProfile conformanceProfile) {

        if(conformanceProfile.getCoConstraintsBindings() != null && conformanceProfile.getCoConstraintsBindings().size() > 0) {
            Element cp = new Element("ByMessage");
            cp.addAttribute(attr("ID", conformanceProfile.getId()));
            conformanceProfile.getCoConstraintsBindings().stream()
                    .map((binding) -> this.serializeBinding(binding, conformanceProfile.getId()))
                    .forEach(cp::appendChild);
            return cp;
        }
        return null;

    }

    public Element serializeBinding(CoConstraintBinding coConstraintBinding, String cpId) {
        Element context = new Element("Context");
        context.addAttribute(attr("Name", coConstraintBinding.getContext().getName()));
        context.addAttribute(attr("Path", this.getPathInConformanceProfile(coConstraintBinding.getContext().getPathId(), cpId)));

        coConstraintBinding.getBindings().stream().map((segment) ->
                        serializeCoConstraintForSegment(coConstraintBinding.getContext(), segment, cpId)
                ).forEach(context::appendChild);

        return context;
    }

    public Element serializeGrouper(CoConstraintGrouper ccGrouper, CoConstraintBindingSegment segment) {
        Element element = new Element("CoConstraintGroupId");
        if(ccGrouper.getDatatype().equals("OG")) {
            // Compatibility Mode
            Element groupIdCompMode = new Element("IdPath");
            groupIdCompMode.addAttribute(attr("Priority", "1"));
            groupIdCompMode.addAttribute(attr("Name", ccGrouper.getName() + ".1"));
            groupIdCompMode.addAttribute(attr("Path", getPathInSegment(ccGrouper.getPathId(), segment.getFlavorId()) + ".1[*]"));
            // Enhanced Mode
            Element groupIdEnhancedMode = new Element("IdPath");
            groupIdEnhancedMode.addAttribute(attr("Priority", "2"));
            groupIdEnhancedMode.addAttribute(attr("Name", ccGrouper.getName() + ".2"));
            groupIdEnhancedMode.addAttribute(attr("Path", getPathInSegment(ccGrouper.getPathId(), segment.getFlavorId()) + ".2[*]"));

            element.appendChild(groupIdCompMode);
            element.appendChild(groupIdEnhancedMode);

            return element;
        } else {
            Element groupId = new Element("IdPath");
            groupId.addAttribute(attr("Priority", "1"));
            groupId.addAttribute(attr("Name", ccGrouper.getName()));
            groupId.addAttribute(attr("Path", getPathInSegment(ccGrouper.getPathId(), segment.getFlavorId())));
            element.appendChild(groupId);

            return element;
        }
    }

    public Element serializeCoConstraintForSegment(StructureElementRef context, CoConstraintBindingSegment segment, String cpId) {
        Element group = new Element("Segment");
        group.addAttribute(attr("Name", segment.getSegment().getName()));
        if(!Strings.isNullOrEmpty(context.getPathId())) {
            group.addAttribute(attr("Target", this.getPathInGroup(segment.getSegment().getPathId(), cpId, context.getPathId())));
        } else {
            group.addAttribute(attr("Target", this.getPathInConformanceProfile(segment.getSegment().getPathId(), cpId)));
        }

        segment.getTables().stream()
                .filter((table) -> Objects.nonNull(table.getValue()))
                .map((table) -> {
            if(table.getCondition() != null) {
                return serializeConditionalTable(context, cpId, segment, table);
            } else {
                return serializeSimpleTable(segment, table);
            }
        }).forEach(group::appendChild);

        return group;
    }

    public Element serializeConditionalTable(StructureElementRef context, String cpId, CoConstraintBindingSegment segment, CoConstraintTableConditionalBinding table) {
        Element conditional = new Element("ConditionalTable");
        if(table.getValue().getHeaders().getGrouper() != null) {
            conditional.appendChild(this.serializeGrouper(table.getValue().getHeaders().getGrouper(), segment));
        }
        Element condition = this.serializeCondition(context, cpId, segment, table.getCondition());
        conditional.appendChild(condition);
        serializeTable(segment, table.getValue()).forEach(conditional::appendChild);
        return conditional;
    }

    public Element serializeCondition(StructureElementRef context, String cpId, CoConstraintBindingSegment segment, Assertion assertion) {
        Element condition = new Element("Condition");
        Element description = new Element("Description");
        description.appendChild(assertion.getDescription());

        if(!Strings.isNullOrEmpty(context.getPathId())) {
            InstancePath groupInstancePath = this.generatePathService.getInstancePath(context.getPathId(), "*");
            String script = this.assertionXMLSerialization.generateAssertionScript(assertion, Level.GROUP, cpId, groupInstancePath, false);
            Element element = new Element("Assertion");
            element.appendChild(this.innerXMLHandler(script));
            condition.appendChild(element);
        } else {
            String script = this.assertionXMLSerialization.generateAssertionScript(assertion, Level.CONFORMANCEPROFILE, cpId, null, false);
            condition.appendChild(script);
        }

        condition.appendChild(description);
        return condition;
    }

    public Element serializeSimpleTable(CoConstraintBindingSegment segment, CoConstraintTableConditionalBinding table) {
        Element simple = new Element("SimpleTable");
        if(table.getValue().getHeaders().getGrouper() != null) {
            simple.appendChild(this.serializeGrouper(table.getValue().getHeaders().getGrouper(), segment));
        }
        serializeTable(segment, table.getValue()).forEach(simple::appendChild);
        return simple;
    }

    public List<Element> serializeTable(CoConstraintBindingSegment segment, CoConstraintTable table) {
        CoConstraintTable merged = this.coConstraintService.resolveRefAndMerge(table);
        List<Element> items = merged.getCoConstraints().stream().map((cc) ->
                serializeCoConstraint(segment, merged, cc, false)
        ).collect(Collectors.toList());

        items.addAll(
                merged.getGroups().stream()
                    .filter((group) ->
                            group instanceof CoConstraintGroupBindingContained
                    )
                    .map((group) ->
                            serializeCoConstraintGroup(segment, merged, (CoConstraintGroupBindingContained) group)
                    )
            .collect(Collectors.toList())
        );

        return items;
    }

    public Element serializeCoConstraint(CoConstraintBindingSegment segment, CoConstraintTable table, CoConstraint cc, boolean primary) {
        Element coConstraint = new Element(primary ? "Primary" : "CoConstraint");
        coConstraint.addAttribute(attr("Min", cc.getRequirement().getCardinality().getMin() + ""));
        coConstraint.addAttribute(attr("Max", cc.getRequirement().getCardinality().getMax()));
        coConstraint.addAttribute(attr("Usage", cc.getRequirement().getUsage().name()));

        Element selectors = new Element("Selectors");
        this.serializeHeaders(segment, table.getHeaders().getSelectors(), cc).forEach(selectors::appendChild);
        Element constraints = new Element("Constraints");
        this.serializeHeaders(segment, table.getHeaders().getConstraints(), cc).forEach(constraints::appendChild);

        coConstraint.appendChild(selectors);
        coConstraint.appendChild(constraints);

        return coConstraint;
    }

    public List<Element> serializeHeaders(CoConstraintBindingSegment segment, List<CoConstraintHeader> headers, CoConstraint cc) {
        return  headers
                .stream()
                .filter((header) -> header instanceof DataElementHeader)
                .map((header) -> (DataElementHeader) header)
                .map((header) -> {
                    CoConstraintCell cell = cc.getCells().get(header.getKey());
                    return this.serializeCell(segment, header.getColumnType(), cell, header);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Element serializeCell(CoConstraintBindingSegment segment, ColumnType type, CoConstraintCell cell, DataElementHeader header) {
        if(type == null || cell == null) {
            return null;
        }

        switch (type) {
            case CODE:
                if(!(cell instanceof  CodeCell)) return null;
                return this.serializeCodeCell(segment, header, (CodeCell) cell);
            case VALUESET:
                if(!(cell instanceof  ValueSetCell)) return null;
                return this.serializeValueSetCell(segment, header, (ValueSetCell) cell);
            case DATATYPE:
                if(!(cell instanceof  DatatypeCell)) return null;
                return this.serializeDatatypeCell(segment, header, (DatatypeCell) cell);
            case VARIES:
                if(!(cell instanceof  VariesCell)) return null;
                return this.serializeVariesCell(segment, header, (VariesCell) cell);
            case VALUE:
                if(!(cell instanceof  ValueCell)) return null;
                return this.serializeValueCell(segment, header, (ValueCell) cell);
        }
        return null;
    }

    public Element serializeCodeCell(CoConstraintBindingSegment segment, DataElementHeader header, CodeCell cell) {
        Element code = new Element("Code");
        code.addAttribute(attr("Name", header.getName()));
        code.addAttribute(attr("Code", cell.getCode()));
        code.addAttribute(attr("CodeSystem", cell.getCodeSystem()));
        code.addAttribute(attr("Path", getPathInSegment(header.getKey(), segment.getFlavorId())));
        cell.getLocations().stream().map((location) -> {
            Element bindingLocation = new Element("BindingLocation");
            bindingLocation.addAttribute(attr("Position", location + ""));
            bindingLocation.addAttribute(attr("CodePath", location + "[1]"));
            bindingLocation.addAttribute(attr("CodeSystemPath", (location + 2) + "[1]"));
            return bindingLocation;
        }).forEach(code::appendChild);
        return code;
    }

    public Element serializeValueSetCell(CoConstraintBindingSegment segment, DataElementHeader header, ValueSetCell cell) {
        Element valueSet = new Element("ValueSet");
        valueSet.addAttribute(attr("Name", header.getName()));
        valueSet.addAttribute(attr("Path", getPathInSegment(header.getKey(), segment.getFlavorId())));
        cell.getBindings().stream().map((binding) -> {
            Element vsBinding = new Element("ValueSetBinding");
            vsBinding.addAttribute(attr("Target", "."));
            vsBinding.addAttribute(attr("BindingStrength", binding.getStrength().name()));

            Element vsBindingLocations = new Element("BindingLocations");
            binding.getValuesetLocations().stream().map((vsLocation) -> {
                Element bindingLocation = new Element("ComplexBindingLocation");
                bindingLocation.addAttribute(attr("CodeLocation", vsLocation + "[1]"));
                bindingLocation.addAttribute(attr("CodeSystemLocation", (vsLocation + 2) + "[1]"));
                return bindingLocation;
            }).forEach(vsBindingLocations::appendChild);
            vsBinding.appendChild(vsBindingLocations);

            Element vsBindings = new Element("Bindings");
            binding.getValueSets().stream().map((vsId) -> {
                Element vs = new Element("Binding");
                /// TODO vsId to BindingIdentifier
                vs.addAttribute(attr("BindingIdentifier", vsId));
                return vs;
            }).forEach(vsBindings::appendChild);
            vsBinding.appendChild(vsBindings);

            return vsBinding;
        }).forEach(valueSet::appendChild);
        return valueSet;
    }

    public Element serializeDatatypeCell(CoConstraintBindingSegment segment, DataElementHeader header, DatatypeCell cell) {
        Element datatype = new Element("PlainText");
        datatype.addAttribute(attr("Name", header.getName()));
        datatype.addAttribute(attr("Path", getPathInSegment(header.getKey(), segment.getFlavorId())));
        datatype.addAttribute(attr("Value", cell.getValue()));
        return datatype;
    }

    public Element serializeValueCell(CoConstraintBindingSegment segment, DataElementHeader header, ValueCell cell) {
        Element value = new Element("PlainText");
        value.addAttribute(attr("Name", header.getName()));
        value.addAttribute(attr("Path", getPathInSegment(header.getKey(), segment.getFlavorId())));
        value.addAttribute(attr("Value", cell.getValue()));
        return value;
    }


    public Element serializeVariesCell(CoConstraintBindingSegment segment, DataElementHeader header, VariesCell cell) {
        return this.serializeCell(segment, cell.getCellType(), cell.getCellValue(), header);
    }

    public Element serializeCoConstraintGroup(CoConstraintBindingSegment segment, CoConstraintTable table, CoConstraintGroupBindingContained group) {
        Element coConstraintGroup = new Element("CoConstraintGroup");
        coConstraintGroup.addAttribute(attr("Min", group.getRequirement().getCardinality().getMin() + ""));
        coConstraintGroup.addAttribute(attr("Max", group.getRequirement().getCardinality().getMax()));
        coConstraintGroup.addAttribute(attr("Usage", group.getRequirement().getUsage().name()));
        coConstraintGroup.addAttribute(attr("Name", group.getName()));
        for(int i = 0; i < group.getCoConstraints().size(); i++) {
            CoConstraint cc = group.getCoConstraints().get(i);
            coConstraintGroup.appendChild(
                    this.serializeCoConstraint(segment, table, cc, i == 0)
            );
        }
        return coConstraintGroup;
    }


    private Node innerXMLHandler(String xml) {
        if (xml != null && !xml.equals("")) {
            xml = xml.replace("&", "&amp;");
            Builder builder = new Builder(new NodeFactory());
            try {
                Document doc = builder.build(xml, null);
                return doc.getRootElement().copy();
            } catch (ValidityException e) {
                e.printStackTrace();
            } catch (ParsingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public Attribute attr(String name, String value) {
        return new Attribute(name, Strings.isNullOrEmpty(value) ? "" : value);
    }
}
