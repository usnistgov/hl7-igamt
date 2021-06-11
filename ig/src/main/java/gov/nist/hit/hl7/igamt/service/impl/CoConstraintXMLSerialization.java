package gov.nist.hit.hl7.igamt.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Assertion;
import nu.xom.Attribute;
import nu.xom.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
public class CoConstraintXMLSerialization {

    @Autowired
    CoConstraintService coConstraintService;


    public Element serialize(ConformanceProfile conformanceProfile) {

        if(conformanceProfile.getCoConstraintsBindings() != null && conformanceProfile.getCoConstraintsBindings().size() > 0) {
            Element cp = new Element("ByMessage");
            cp.addAttribute(attr("ID", conformanceProfile.getId()));
            conformanceProfile.getCoConstraintsBindings().stream()
                    .map(this::serializeBinding)
                    .flatMap(Collection::stream)
                    .forEach(cp::appendChild);
            return cp;
        }
        return null;

    }

    public List<Element> serializeBinding(CoConstraintBinding coConstraintBinding) {
        return coConstraintBinding.getBindings().stream().map((segment) ->
                        serializeCoConstraintForContextAndSegment(coConstraintBinding.getContext(), segment)
                ).collect(Collectors.toList());
    }

    public Element serializeCoConstraintForContextAndSegment(StructureElementRef context, CoConstraintBindingSegment segment) {
        Element group = new Element("Group");
        group.addAttribute(attr("Context", context.getName()));
        group.addAttribute(attr("Name", segment.getName()));
        /// TODO Make Path from Path Instance
        // Target -> segment.getSegment().getPath()
        segment.getTables().stream().map((table) -> {
            if(table.getCondition() != null) {
                return serializeConditionalTable(context, segment, table);
            } else {
                return serializeSimpleTable(context, segment, table);
            }
        }).forEach(group::appendChild);

        return group;
    }

    public Element serializeConditionalTable(StructureElementRef context, CoConstraintBindingSegment segment, CoConstraintTableConditionalBinding table) {
        Element conditional = new Element("ConditionalTable");
        Element condition = this.serializeCondition(context, segment, table.getCondition());
        conditional.appendChild(condition);
        serializeTable(context, segment, table.getValue()).forEach(conditional::appendChild);
        return conditional;
    }

    public Element serializeCondition(StructureElementRef context, CoConstraintBindingSegment segment, Assertion assertion) {
        Element condition = new Element("Condition");
        Element description = new Element("Description");
        description.appendChild(assertion.getDescription());
        /// TODO Serialize assertion
        condition.appendChild(description);
        return condition;
    }

    public Element serializeSimpleTable(StructureElementRef context, CoConstraintBindingSegment segment, CoConstraintTableConditionalBinding table) {
        Element simple = new Element("SimpleTable");
        serializeTable(context, segment, table.getValue()).forEach(simple::appendChild);
        return simple;
    }

    public List<Element> serializeTable(StructureElementRef context, CoConstraintBindingSegment segment, CoConstraintTable table) {
        CoConstraintTable merged = this.coConstraintService.resolveRefAndMerge(table);
        List<Element> items = merged.getCoConstraints().stream().map((cc) ->
                serializeCoConstraint(context, segment, merged, cc, false)
        ).collect(Collectors.toList());

        items.addAll(
                merged.getGroups().stream()
                    .filter((group) ->
                            group instanceof CoConstraintGroupBindingContained
                    )
                    .map((group) ->
                            serializeCoConstraintGroup(context, segment, merged, (CoConstraintGroupBindingContained) group)
                    )
            .collect(Collectors.toList())
        );

        return items;
    }

    public Element serializeCoConstraint(StructureElementRef context, CoConstraintBindingSegment segment, CoConstraintTable table, CoConstraint cc, boolean primary) {
        Element coConstraint = new Element(primary ? "Primary" : "CoConstraint");
        coConstraint.addAttribute(attr("Min", cc.getRequirement().getCardinality().getMin() + ""));
        coConstraint.addAttribute(attr("Max", cc.getRequirement().getCardinality().getMax()));
        coConstraint.addAttribute(attr("Usage", cc.getRequirement().getUsage().name()));

        Element selectors = new Element("Selectors");
        this.serializeHeaders(context, segment, table.getHeaders().getSelectors(), cc).forEach(selectors::appendChild);
        Element constraints = new Element("Constraints");
        this.serializeHeaders(context, segment, table.getHeaders().getConstraints(), cc).forEach(constraints::appendChild);

        coConstraint.appendChild(selectors);
        coConstraint.appendChild(constraints);

        return coConstraint;
    }

    public List<Element> serializeHeaders(StructureElementRef context, CoConstraintBindingSegment segment, List<CoConstraintHeader> headers, CoConstraint cc) {
        return  headers
                .stream()
                .filter((header) -> header instanceof DataElementHeader)
                .map((header) -> (DataElementHeader) header)
                .map((header) -> {
                    CoConstraintCell cell = cc.getCells().get(header.getKey());
                    return this.serializeCell(context, segment, header.getColumnType(), cell, header);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Element serializeCell(StructureElementRef context, CoConstraintBindingSegment segment, ColumnType type, CoConstraintCell cell, DataElementHeader header) {
        if(type == null || cell == null) {
            return null;
        }

        switch (type) {
            case CODE:
                if(!(cell instanceof  CodeCell)) return null;
                return this.serializeCodeCell(context, segment, header, (CodeCell) cell);
            case VALUESET:
                if(!(cell instanceof  ValueSetCell)) return null;
                return this.serializeValueSetCell(context, segment, header, (ValueSetCell) cell);
            case DATATYPE:
                if(!(cell instanceof  DatatypeCell)) return null;
                return this.serializeDatatypeCell(context, segment, header, (DatatypeCell) cell);
            case VARIES:
                if(!(cell instanceof  VariesCell)) return null;
                return this.serializeVariesCell(context, segment, header, (VariesCell) cell);
            case VALUE:
                if(!(cell instanceof  ValueCell)) return null;
                return this.serializeValueCell(context, segment, header, (ValueCell) cell);
        }
        return null;
    }

    public Element serializeCodeCell(StructureElementRef context, CoConstraintBindingSegment segment, DataElementHeader header, CodeCell cell) {
        Element code = new Element("Code");
        code.addAttribute(attr("Name", header.getName()));
        code.addAttribute(attr("Code", cell.getCode()));
        code.addAttribute(attr("CodeSystem", cell.getCodeSystem()));
        code.addAttribute(attr("Path", keyToPath(header.getKey())));
        cell.getLocations().stream().map((location) -> {
            Element bindingLocation = new Element("BindingLocation");
            bindingLocation.addAttribute(attr("Position", location + ""));
            bindingLocation.addAttribute(attr("CodePath", location + "[1]"));
            bindingLocation.addAttribute(attr("CodeSystemPath", (location + 2) + "[1]"));
            return bindingLocation;
        }).forEach(code::appendChild);
        return code;
    }

    public Element serializeValueSetCell(StructureElementRef context, CoConstraintBindingSegment segment, DataElementHeader header, ValueSetCell cell) {
        Element valueSet = new Element("ValueSet");
        valueSet.addAttribute(attr("Name", header.getName()));
        valueSet.addAttribute(attr("Path", keyToPath(header.getKey())));
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

    public Element serializeDatatypeCell(StructureElementRef context, CoConstraintBindingSegment segment, DataElementHeader header, DatatypeCell cell) {
        Element datatype = new Element("PlainText");
        datatype.addAttribute(attr("Name", header.getName()));
        datatype.addAttribute(attr("Path", keyToPath(header.getKey())));
        datatype.addAttribute(attr("Value", cell.getValue()));
        return datatype;
    }

    public Element serializeValueCell(StructureElementRef context, CoConstraintBindingSegment segment, DataElementHeader header, ValueCell cell) {
        Element value = new Element("PlainText");
        value.addAttribute(attr("Name", header.getName()));
        value.addAttribute(attr("Path", keyToPath(header.getKey())));
        value.addAttribute(attr("Value", cell.getValue()));
        return value;
    }

    public String keyToPath(String key) {
        String[] parts = key.split("-");
        return String.join(".[*]", parts) + "[*]";
    }

    public Element serializeVariesCell(StructureElementRef context, CoConstraintBindingSegment segment, DataElementHeader header, VariesCell cell) {
        return this.serializeCell(context, segment, cell.getCellType(), cell.getCellValue(), header);
    }

    public Element serializeCoConstraintGroup(StructureElementRef context, CoConstraintBindingSegment segment, CoConstraintTable table, CoConstraintGroupBindingContained group) {
        Element coConstraintGroup = new Element("CoConstraintGroup");
        coConstraintGroup.addAttribute(attr("Min", group.getRequirement().getCardinality().getMin() + ""));
        coConstraintGroup.addAttribute(attr("Max", group.getRequirement().getCardinality().getMax()));
        coConstraintGroup.addAttribute(attr("Usage", group.getRequirement().getUsage().name()));
        coConstraintGroup.addAttribute(attr("Name", group.getName()));
        for(int i = 0; i < group.getCoConstraints().size(); i++) {
            CoConstraint cc = group.getCoConstraints().get(i);
            coConstraintGroup.appendChild(
                    this.serializeCoConstraint(context, segment, table, cc, i == 0)
            );
        }
        return coConstraintGroup;
    }




    public Attribute attr(String name, String value) {
        return new Attribute(name, Strings.isNullOrEmpty(value) ? "" : value);
    }
}
