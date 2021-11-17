package gov.nist.hit.hl7.igamt.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Assertion;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.service.CoConstraintXMLSerialization;
import gov.nist.hit.hl7.igamt.service.impl.exception.CoConstraintXMLSerializationException;
import nu.xom.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class SimpleCoConstraintXMLSerialization implements CoConstraintXMLSerialization {

    @Autowired
    CoConstraintService coConstraintService;

    @Autowired
    AssertionXMLSerialization assertionXMLSerialization;

    @Autowired
    GeneratePathService generatePathService;

    @Autowired
    ResourceSkeletonService resourceSkeletonService;

    public String getXMLPathFromPositionalPath(String positional) {
        if(!Strings.isNullOrEmpty(positional)) {
            return Arrays.stream(positional.split("\\."))
                    .map((v) -> v + "[*]")
                    .collect(Collectors.joining("."));
        }
        return ".";
    }

    public String getRelativeXMLPathFromPositionalPath(String positional, String context) {
        if(!Strings.isNullOrEmpty(positional)) {
            if(positional.startsWith(context) && positional.length() > context.length()) {
                return this.getXMLPathFromPositionalPath(positional.substring(context.length()));
            }
        }
        return ".";
    }

    @Override
    public Element serialize(ConformanceProfile conformanceProfile) throws CoConstraintXMLSerializationException {
        ResourceSkeleton skeleton = new ResourceSkeleton(
                new ResourceRef(Type.CONFORMANCEPROFILE, conformanceProfile.getId()),
                this.resourceSkeletonService
        );

        if(conformanceProfile.getCoConstraintsBindings() != null && conformanceProfile.getCoConstraintsBindings().size() > 0) {
            Element cp = new Element("ByMessage");
            cp.addAttribute(attr("ID", conformanceProfile.getId()));
            for(CoConstraintBinding binding: conformanceProfile.getCoConstraintsBindings()) {
                cp.appendChild(
                        this.serializeBinding(skeleton, binding, conformanceProfile.getId())
                );
            }
            return cp;
        }
        return null;

    }

    @Override
    public Element serializeBinding(ResourceSkeleton conformanceProfile, CoConstraintBinding coConstraintBinding, String cpId) throws CoConstraintXMLSerializationException {
        try {
            ResourceSkeletonBone contextElement = conformanceProfile.get(coConstraintBinding.getContext().getPath());
            if(contextElement != null) {
                Element context = new Element("Context");
                context.addAttribute(attr("Name", contextElement.getLocationInfo().getHl7Path()));
                context.addAttribute(attr("Path", getXMLPathFromPositionalPath(contextElement.getLocationInfo().getPositionalPath())));

                if(coConstraintBinding.getBindings() != null) {
                    for(CoConstraintBindingSegment segment: coConstraintBinding.getBindings()) {
                        context.appendChild(serializeCoConstraintForSegment(contextElement, coConstraintBinding.getContext(), segment, cpId));
                    }
                }

                return context;
            } else {
                throw new CoConstraintXMLSerializationException("Context not found " + coConstraintBinding.getContext().getPath());
            }
        } catch (ResourceNotFoundException e) {
            throw new CoConstraintXMLSerializationException(e.getMessage());
        }
    }

    @Override
    public Element serializeGrouper(ResourceSkeleton segment, CoConstraintGrouper ccGrouper) throws CoConstraintXMLSerializationException {
        Element element = new Element("CoConstraintGroupId");
        try {
            ResourceSkeletonBone grouper = segment.get(ccGrouper.getPathId());
            if(grouper != null) {
                String hl7Path = grouper.getLocationInfo().getHl7Path();
                String xmlPath = getXMLPathFromPositionalPath(grouper.getLocationInfo().getPositionalPath());
                if(grouper.getResource().getFixedName().equals("OG")) {
                    // Compatibility Mode
                    Element groupIdCompMode = new Element("IdPath");
                    groupIdCompMode.addAttribute(attr("Priority", "1"));
                    groupIdCompMode.addAttribute(attr("Name", hl7Path + ".1"));
                    groupIdCompMode.addAttribute(attr("Path", xmlPath + ".1[*]"));
                    // Enhanced Mode
                    Element groupIdEnhancedMode = new Element("IdPath");
                    groupIdEnhancedMode.addAttribute(attr("Priority", "2"));
                    groupIdEnhancedMode.addAttribute(attr("Name", hl7Path  + ".2"));
                    groupIdEnhancedMode.addAttribute(attr("Path", xmlPath + ".2[*]"));

                    element.appendChild(groupIdCompMode);
                    element.appendChild(groupIdEnhancedMode);

                    return element;
                } else if(grouper.getResource().isLeaf()) {
                    Element groupId = new Element("IdPath");
                    groupId.addAttribute(attr("Priority", "1"));
                    groupId.addAttribute(attr("Name", hl7Path));
                    groupId.addAttribute(attr("Path", xmlPath));
                    element.appendChild(groupId);

                    return element;
                } else {
                    throw new CoConstraintXMLSerializationException("Could not serialize grouper " + hl7Path + " Incompatible Datatype : " + grouper.getResource().getFixedName());
                }
            } else {
                throw new CoConstraintXMLSerializationException("Grouper not found at path " + ccGrouper.getPathId());
            }
        } catch (ResourceNotFoundException e) {
            throw new CoConstraintXMLSerializationException(e.getMessage());
        }
    }

    @Override
    public Element serializeCoConstraintForSegment(ResourceSkeleton context, StructureElementRef contextRef, CoConstraintBindingSegment bindingSegment, String cpId) throws CoConstraintXMLSerializationException {
        try {
            ResourceSkeletonBone segment = context.get(bindingSegment.getSegment().getPathId());
            if(segment != null) {
                if(segment.getResource().getType().equals(Type.SEGMENT)) {
                    Element group = new Element("Segment");
                    String relativePositional = context instanceof ResourceSkeletonBone ?
                            this.getRelativeXMLPathFromPositionalPath(segment.getLocationInfo().getPositionalPath(), ((ResourceSkeletonBone) context).getLocationInfo().getPositionalPath()) :
                            this.getXMLPathFromPositionalPath(segment.getLocationInfo().getPositionalPath());

                    group.addAttribute(attr("Name", segment.getResource().getFixedName()));
                    group.addAttribute(attr("Target", relativePositional));

                    ResourceSkeleton segmentSkeleton = new ResourceSkeleton(
                            new ResourceRef(Type.SEGMENT, segment.getResource().getId()),
                            this.resourceSkeletonService
                    );

                    if(bindingSegment.getTables() != null) {
                        for(CoConstraintTableConditionalBinding table: bindingSegment.getTables()) {
                            if(table != null) {
                                if(table.getCondition() != null) {
                                    group.appendChild(
                                            serializeConditionalTable(segmentSkeleton, contextRef, cpId, table)
                                    );
                                } else {
                                    group.appendChild(
                                            serializeSimpleTable(segmentSkeleton, table)
                                    );
                                }
                            }
                        }
                    }
                    return group;
                } else {
                    throw new CoConstraintXMLSerializationException("Target element at path " + segment.getLocationInfo().getHl7Path() + " is not a segment ref");
                }
            } else {
                throw new CoConstraintXMLSerializationException("Target segment not found at path " + bindingSegment.getSegment().getPathId());
            }
        } catch (ResourceNotFoundException e) {
            throw new CoConstraintXMLSerializationException(e.getMessage());
        }
    }

    @Override
    public Element serializeConditionalTable(ResourceSkeleton segment, StructureElementRef context, String cpId, CoConstraintTableConditionalBinding table) throws CoConstraintXMLSerializationException {
        Element conditional = new Element("ConditionalTable");
        if(table.getValue().getHeaders().getGrouper() != null) {
            conditional.appendChild(this.serializeGrouper(segment, table.getValue().getHeaders().getGrouper()));
        }
        Element condition = this.serializeCondition(context, cpId, table.getCondition());
        conditional.appendChild(condition);
        serializeTable(segment, table.getValue()).forEach(conditional::appendChild);
        return conditional;
    }

    @Override
    public Element serializeCondition(StructureElementRef context, String cpId, Assertion assertion) {
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

    @Override
    public Element serializeSimpleTable(ResourceSkeleton segment, CoConstraintTableConditionalBinding table) throws CoConstraintXMLSerializationException {
        Element simple = new Element("SimpleTable");
        if(table.getValue().getHeaders().getGrouper() != null) {
            simple.appendChild(this.serializeGrouper(segment, table.getValue().getHeaders().getGrouper()));
        }
        serializeTable(segment, table.getValue()).forEach(simple::appendChild);
        return simple;
    }

    @Override
    public List<Element> serializeTable(ResourceSkeleton segment, CoConstraintTable table) throws CoConstraintXMLSerializationException {
        CoConstraintTable merged = this.coConstraintService.resolveRefAndMerge(table);
        List<Element> items = new ArrayList<>();
        if(merged.getCoConstraints() != null) {
            for(CoConstraint cc: merged.getCoConstraints()) {
                items.add(serializeCoConstraint(segment, merged, cc, false));
            }
        }
        if(merged.getGroups() != null) {
            List<CoConstraintGroupBindingContained> groups = merged.getGroups().stream()
                    .filter((group) ->
                            group instanceof CoConstraintGroupBindingContained
                    ).map((group) -> (CoConstraintGroupBindingContained) group)
                    .collect(Collectors.toList());
            for(CoConstraintGroupBindingContained group: groups) {
                items.add(serializeCoConstraintGroup(segment, merged, group));
            }
        }
        return items;
    }

    @Override
    public Element serializeCoConstraint(ResourceSkeleton segment, CoConstraintTable table, CoConstraint cc, boolean primary) throws CoConstraintXMLSerializationException {
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

    @Override
    public List<Element> serializeHeaders(ResourceSkeleton segment, List<CoConstraintHeader> headers, CoConstraint cc) throws CoConstraintXMLSerializationException {
        List<Element> cells = new ArrayList<>();
        Set<DataElementHeader> dataElementHeaders = headers
                .stream()
                .filter((header) -> header instanceof DataElementHeader)
                .map((header) -> (DataElementHeader) header)
                .collect(Collectors.toSet());
        for(DataElementHeader header: dataElementHeaders) {
            CoConstraintCell cell = cc.getCells().get(header.getKey());
            Element element = this.serializeCell(segment, header.getColumnType(), cell, header);
            if(element != null) {
                cells.add(element);
            }
        }
        return cells;
    }

    @Override
    public Element serializeCell(ResourceSkeleton segment, ColumnType type, CoConstraintCell cell, DataElementHeader header) throws CoConstraintXMLSerializationException {
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

    public Element processDataElementHeader(ResourceSkeleton segment, DataElementHeader header, Function<ResourceSkeletonBone, Element> process) throws CoConstraintXMLSerializationException {
        try {
            ResourceSkeletonBone target = segment.get(header.getKey());
            if(target != null) {
                return process.apply(target);
            } else {
                throw new CoConstraintXMLSerializationException("Header target not found at path " + header.getKey());
            }
        } catch (ResourceNotFoundException e) {
            throw new CoConstraintXMLSerializationException(e.getMessage());
        }
    }

    @Override
    public Element serializeCodeCell(ResourceSkeleton segment, DataElementHeader header, CodeCell cell) throws CoConstraintXMLSerializationException {
        return this.processDataElementHeader(segment, header, (target) -> {
            Element code = new Element("Code");
            code.addAttribute(attr("Name", target.getLocationInfo().getHl7Path()));
            code.addAttribute(attr("Code", cell.getCode()));
            code.addAttribute(attr("CodeSystem", cell.getCodeSystem()));
            code.addAttribute(attr("Path", this.getXMLPathFromPositionalPath(target.getLocationInfo().getPositionalPath())));
            cell.getLocations().stream().map((location) -> {
                Element bindingLocation = new Element("BindingLocation");
                bindingLocation.addAttribute(attr("Position", location + ""));
                bindingLocation.addAttribute(attr("CodePath", location + "[1]"));
                bindingLocation.addAttribute(attr("CodeSystemPath", (location + 2) + "[1]"));
                return bindingLocation;
            }).forEach(code::appendChild);
            return code;
        });
    }

    @Override
    public Element serializeValueSetCell(ResourceSkeleton segment, DataElementHeader header, ValueSetCell cell) throws CoConstraintXMLSerializationException {
        return this.processDataElementHeader(segment, header, (target) -> {
            Element valueSet = new Element("ValueSet");
            valueSet.addAttribute(attr("Name", target.getLocationInfo().getHl7Path()));
            valueSet.addAttribute(attr("Path", this.getXMLPathFromPositionalPath(target.getLocationInfo().getPositionalPath())));
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
        });

    }

    @Override
    public Element serializeDatatypeCell(ResourceSkeleton segment, DataElementHeader header, DatatypeCell cell) throws CoConstraintXMLSerializationException {
        return this.processDataElementHeader(segment, header, (target) -> {
            Element datatype = new Element("PlainText");
            datatype.addAttribute(attr("Name", target.getLocationInfo().getHl7Path()));
            datatype.addAttribute(attr("Path", this.getXMLPathFromPositionalPath(target.getLocationInfo().getPositionalPath())));
            datatype.addAttribute(attr("Value", cell.getValue()));
            return datatype;
        });
    }

    @Override
    public Element serializeValueCell(ResourceSkeleton segment, DataElementHeader header, ValueCell cell) throws CoConstraintXMLSerializationException {
        return this.processDataElementHeader(segment, header, (target) -> {
            Element value = new Element("PlainText");
            value.addAttribute(attr("Name", target.getLocationInfo().getHl7Path()));
            value.addAttribute(attr("Path", this.getXMLPathFromPositionalPath(target.getLocationInfo().getPositionalPath())));
            value.addAttribute(attr("Value", cell.getValue()));
            return value;
        });
    }

    @Override
    public Element serializeVariesCell(ResourceSkeleton segment, DataElementHeader header, VariesCell cell) throws CoConstraintXMLSerializationException {
        return this.serializeCell(segment, cell.getCellType(), cell.getCellValue(), header);
    }

    @Override
    public Element serializeCoConstraintGroup(ResourceSkeleton segment, CoConstraintTable table, CoConstraintGroupBindingContained group) throws CoConstraintXMLSerializationException {
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
            } catch (ParsingException | IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public Attribute attr(String name, String value) {
        return new Attribute(name, Strings.isNullOrEmpty(value) ? "" : value);
    }
}
