package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationOption;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CoConstraintVerificationService extends VerificationUtils {

    @Autowired
    ResourceSkeletonService resourceSkeletonService;

    @Autowired
    AssertionVerificationService assertionVerificationService;

    @Autowired
    CoConstraintService coConstraintService;

    @Autowired
    VocabularyBindingVerificationService vocabularyBindingVerificationService;

    @Autowired
    DatatypeService datatypeService;

    public List<IgamtObjectError> checkCoConstraintBinding(ResourceSkeleton resource, CoConstraintBinding coConstraintBinding) {
        return this.getTargetAndVerify(
            resource,
            PropertyType.COCONSTRAINTBINDINGS,
            coConstraintBinding.getContext().getPathId(),
            null,
            coConstraintBinding.getContext().getPath(),
            resource,
            "CoConstraint Binding Context",
            (target) -> {
                if (coConstraintBinding.getBindings() != null) {
                    String name = (target instanceof ResourceSkeletonBone) ? ((ResourceSkeletonBone) target).getLocationInfo().getHl7Path() : target.getResource().getFixedName();
                    return coConstraintBinding.getBindings().stream().flatMap(
                            (coConstraintBindingSegment) -> checkCoConstraintBindingSegment(
                                                                    target,
                                                                    TargetLocation.makeContextLocation(coConstraintBinding.getContext().getPathId(), name),
                                                                    coConstraintBindingSegment
                                                            ).stream()
                    ).collect(Collectors.toList());
                } else {
                    return this.NoErrors();
                }
            }
        ).stream().peek((entry) -> {
            entry.setTarget(resource.getResource().getId());
            entry.setTargetType(resource.getResource().getType());
        }).collect(Collectors.toList());
    }

    public List<IgamtObjectError> checkCoConstraintBindingSegment(ResourceSkeleton context, TargetLocation contextLocation, CoConstraintBindingSegment coConstraintBindingSegment) {
        return this.getTargetAndVerify(
                context,
                PropertyType.COCONSTRAINTBINDINGS,
                contextLocation.pathId,
                coConstraintBindingSegment.getSegment().getPath(),
                "CoConstraint Segment Ref",
                (element) -> {
                    // Should be bone, if not
                    if (!(element instanceof ResourceSkeletonBone)) {
                        return Collections.singletonList(
                                this.entry.CoConstraintTargetIsNotSegment(
                                        contextLocation.pathId,
                                        contextLocation.name,
                                        context.getResource().getId(),
                                        context.getResource().getType(),
                                        coConstraintBindingSegment.getSegment().getPathId(),
                                        "Co-Constraint Target Segment Ref"
                                )
                        );
                    } else {
                        ResourceSkeletonBone target = (ResourceSkeletonBone) element;
                        TargetLocation segmentLocation = TargetLocation.makeSegmentLocation(
                                contextLocation,
                                coConstraintBindingSegment.getSegment().getPathId(),
                                target.getLocationInfo().getHl7Path()
                        );

                        // If co-constraint target is a segment
                        if (target.getResource().getType().equals(Type.SEGMENT)) {
                            List<IgamtObjectError> errors = new ArrayList<>();
                            if (coConstraintBindingSegment.getTables() != null) {
                                int i = 1;
                                for (CoConstraintTableConditionalBinding tableConditionalBinding : coConstraintBindingSegment.getTables()) {
                                    errors.addAll(checkCoConstraintTableConditionalBinding(
                                            target,
                                            TargetLocation.makeTableLocation(
                                                    segmentLocation,
                                                    tableConditionalBinding.getId(),
                                                    i
                                            ),
                                            tableConditionalBinding
                                    ));
                                    i++;
                                }
                            }
                            return errors;
                        } else {
                            return Collections.singletonList(
                                    this.entry.CoConstraintTargetIsNotSegment(
                                            segmentLocation.pathId,
                                            segmentLocation.name,
                                            context.getResource().getId(),
                                            context.getResource().getType(),
                                            coConstraintBindingSegment.getSegment().getPathId(),
                                            "Co-Constraint Target Segment Ref"
                                    )
                            );
                        }
                    }
                }
        );
    }


    List<IgamtObjectError> checkCoConstraintTableConditionalBinding(ResourceSkeletonBone segmentRef, TargetLocation tableLocation, CoConstraintTableConditionalBinding binding) {
        ResourceSkeleton segment = new ResourceSkeleton(
                segmentRef.getResourceRef(),
                this.resourceSkeletonService
        );

        if(binding.getValue() != null) {
            List<IgamtObjectError> errors = new ArrayList<>();
            TargetLocation conditionLocation = TargetLocation.makeConditionLocation(tableLocation);
            if(binding.getCondition() != null) {
                errors.addAll(
                        this.assertionVerificationService.checkAssertion(
                                segment,
                                new Location(conditionLocation.pathId, conditionLocation.name, PropertyType.COCONSTRAINTBINDING_CONDITION),
                                binding.getCondition()
                        )
                );
            }
            errors.addAll(
                    this.checkCoConstraintTable(segment, tableLocation, binding.getValue())
            );
            return errors;
        } else {
            return this.NoErrors();
        }
    }

    List<IgamtObjectError> checkCoConstraintTable(ResourceSkeleton segment, TargetLocation tableLocation, CoConstraintTable table) {
        List<IgamtObjectError> errors = new ArrayList<>();
        TargetLocation selectorHeadersLocation = TargetLocation.makeHeadersLocation(tableLocation, "selectors", "IF Columns");
        TargetLocation constraintHeadersLocation = TargetLocation.makeHeadersLocation(tableLocation, "constraints", "THEN Columns");

        Map<String, List<IgamtObjectError>> selectors = checkCoConstraintHeaders(segment, selectorHeadersLocation, table.getHeaders().getSelectors());
        Map<String, List<IgamtObjectError>> constraints = checkCoConstraintHeaders(segment, constraintHeadersLocation, table.getHeaders().getConstraints());

        selectors.values().forEach(errors::addAll);
        constraints.values().forEach(errors::addAll);

        List<DataHeaderElementVerified> valid = Stream.concat(
                table.getHeaders().getSelectors().stream(),
                table.getHeaders().getConstraints().stream()
        )
                .filter((header) -> !selectors.containsKey(header.getKey()) && !constraints.containsKey(header.getKey()))
                .map((header) -> this.toVerifiedDataHeaderElement(segment, header))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Validate Co-Constraints
        errors.addAll(checkCoConstraints(segment, tableLocation, table.getCoConstraints(), valid, false));
        // Validate Groups
        if(table.getGroups() != null) {
            int i = 1;
            for(CoConstraintGroupBinding group: table.getGroups()) {
                errors.addAll(
                        checkCoConstraintTableGroup(
                            segment,
                            TargetLocation.makeGroupLocation(tableLocation, group.getId(), i),
                            group,
                            valid,
                            "#"+i++
                        )
                );
            }
        }

        return errors;
    }

    DataHeaderElementVerified toVerifiedDataHeaderElement(ResourceSkeleton segment, CoConstraintHeader header) {
        try {
            ResourceSkeletonBone target = segment.get(header.getKey());
            BindingInfo bindingInfo = getBindingInfo(target.getResource().getFixedName());
            return new DataHeaderElementVerified((DataElementHeader) header, target, bindingInfo);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }


    List<IgamtObjectError> checkCoConstraintTableGroup(ResourceSkeleton segment, TargetLocation groupLocation, CoConstraintGroupBinding group, List<DataHeaderElementVerified> headers, String groupId) {
        if(group instanceof CoConstraintGroupBindingContained) {
            CoConstraintGroupBindingContained contained = (CoConstraintGroupBindingContained) group;
            return checkCoConstraintTableGroup(segment, groupLocation, contained.getRequirement(), contained.getName(), contained.getCoConstraints(), headers);
        } else {
            CoConstraintGroupBindingRef ref = (CoConstraintGroupBindingRef) group;
            try {
                CoConstraintGroup content = this.coConstraintService.findById(ref.getRefId());
                return checkCoConstraintTableGroup(segment, groupLocation, ref.getRequirement(), content.getName(), content.getCoConstraints(), headers);
            } catch (CoConstraintGroupNotFoundException e) {
                return Collections.singletonList(
                    this.entry.CoConstraintInvalidGroupRef(
                            groupLocation.pathId,
                            groupLocation.name,
                            segment.getResource().getId(),
                            segment.getResource().getType()
                    )
                );
            }
        }
    }

    List<IgamtObjectError> checkCoConstraints(ResourceSkeleton segment, TargetLocation groupOrTableLocation, List<CoConstraint> coConstraints, List<DataHeaderElementVerified> headers, boolean group) {
        int i = 1;
        List<IgamtObjectError> errors = new ArrayList<>();
        boolean verifyDatatypeAndVaries = false;
        List<DataHeaderElementVerified> datatypeHeaders = headers.stream()
                .filter((h) -> h.header.getColumnType().equals(ColumnType.DATATYPE))
                .collect(Collectors.toList());
        List<DataHeaderElementVerified> variesHeaders = headers.stream()
                .filter((h) -> h.header.getColumnType().equals(ColumnType.VARIES))
                .collect(Collectors.toList());

        if(datatypeHeaders.size() == 1 && variesHeaders.size() == 1) {
            verifyDatatypeAndVaries = true;
        } else if(datatypeHeaders.size() > 1) {
            // Multiple Datatype Cells
            errors.add(this.entry.CoConstraintMultiDatatypeCells(
                    groupOrTableLocation.pathId,
                    groupOrTableLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType()
            ));
        } else if(variesHeaders.size() >= 1 && datatypeHeaders.size() == 0) {
            // Varies Found but no Datatype Cell
            errors.add(this.entry.CoConstraintNoDatatypeCell(
                    groupOrTableLocation.pathId,
                    groupOrTableLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType()
            ));
        } else if(variesHeaders.size() > 1) {
            // Multiple Varies Cells
            errors.add(this.entry.CoConstraintMultiVariesCells(
                    groupOrTableLocation.pathId,
                    groupOrTableLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType()
            ));
        }

        for(CoConstraint cc: coConstraints) {

            TargetLocation ccLocation = TargetLocation.makeRowLocation(groupOrTableLocation, cc.getId(), i);
            errors.addAll(this.checkCoConstraintRequirement(segment, ccLocation, cc.getRequirement(), false, (i == 1) && group));

            for(DataHeaderElementVerified header: headers) {
                if(cc.getCells().get(header.header.getKey()) != null) {
                    TargetLocation cellLocation = TargetLocation.makeCellLocation(
                            ccLocation,
                            header.header.getKey(),
                            header.target.getLocationInfo(),
                            header.header.getColumnType()
                    );

                    errors.addAll(
                            this.checkCoConstraintCell(segment, header, cellLocation, cc.getCells().get(header.header.getKey()))
                    );
                }
            }

            if(verifyDatatypeAndVaries) {
                DataHeaderElementVerified datatypeHeader = datatypeHeaders.get(0);
                DataHeaderElementVerified variesHeader = variesHeaders.get(0);

                errors.addAll(
                        this.checkDatatypeAndVaries(segment, datatypeHeader, variesHeader, ccLocation, cc)
                );
            }

            i++;
        }
        return errors;
    }

    List<IgamtObjectError> checkCoConstraintTableGroup(ResourceSkeleton segment, TargetLocation groupLocation, CoConstraintRequirement requirement, String name, List<CoConstraint> coConstraints, List<DataHeaderElementVerified> headers) {
        List<IgamtObjectError> errors = new ArrayList<>(this.checkCoConstraintRequirement(segment, groupLocation, requirement, true, false));
        if(Strings.isNullOrEmpty(name)) {
            errors.add(
                    this.entry.CoConstraintGroupNameIsMissing(
                        groupLocation.pathId,
                        groupLocation.name,
                        segment.getResource().getId(),
                        segment.getResource().getType()
                    )
            );
        }
        errors.addAll(
                this.checkCoConstraints(segment, groupLocation, coConstraints, headers, true)
        );
        return errors;
    }

    List<IgamtObjectError> checkCoConstraintRequirement(ResourceSkeleton segment, TargetLocation groupOrRowLocation, CoConstraintRequirement requirement, boolean group, boolean primary) {
        List<IgamtObjectError> errors = new ArrayList<>();
        boolean usage = true;
        boolean min = true;
        boolean max = true;
        // Check Usage
        if(requirement.getUsage() == null) {
            usage = false;
            errors.add(this.entry.CoConstraintUsageMissing(
                    groupOrRowLocation.pathId,
                    groupOrRowLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType(),
                    group
            ));
        } else if(primary && !requirement.getUsage().equals(CoConstraintUsage.R)){
            errors.add(this.entry.CoConstraintPrimaryUsageInvalid(
                    groupOrRowLocation.pathId,
                    groupOrRowLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType(),
                    requirement.getUsage()
            ));
        }
        // Check Cardinality
        if(requirement.getCardinality() == null) {
            min = false;
            errors.add(this.entry.CoConstraintCardinalityMissing(
                    groupOrRowLocation.pathId,
                    groupOrRowLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType(),
                    group,
                    "min"
            ));
        }
        if(requirement.getCardinality() == null || Strings.isNullOrEmpty(requirement.getCardinality().getMax())) {
            max = false;
            errors.add(this.entry.CoConstraintCardinalityMissing(
                    groupOrRowLocation.pathId,
                    groupOrRowLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType(),
                    group,
                    "max"
            ));
        }
        if(min && max) {
            boolean invalid = false;
            if(!requirement.getCardinality().getMax().equals("*")) {
                try {
                    int maxIntValue = Integer.parseInt(requirement.getCardinality().getMax());
                    if(maxIntValue < requirement.getCardinality().getMin() || requirement.getCardinality().getMin() < 0) {
                        invalid = true;
                    }
                } catch (Exception e) {
                    invalid = true;
                }
            }

            if(invalid) {
                errors.add(this.entry.CoConstraintCardinalityInvalid(
                        groupOrRowLocation.pathId,
                        groupOrRowLocation.name,
                        segment.getResource().getId(),
                        segment.getResource().getType(),
                        group,
                        requirement.getCardinality().getMin(),
                        requirement.getCardinality().getMax()
                ));
            }
        }
        // Check Usage and Cardinality
        if(usage && min) {
            if(requirement.getUsage().equals(CoConstraintUsage.R) && requirement.getCardinality().getMin() == 0) {
                errors.add(this.entry.CoConstraintCardinalityAndUsageInvalid(
                        groupOrRowLocation.pathId,
                        groupOrRowLocation.name,
                        segment.getResource().getId(),
                        segment.getResource().getType(),
                        group,
                        requirement.getCardinality().getMin(),
                        requirement.getCardinality().getMax(),
                        requirement.getUsage()
                ));
            }
        }

        return errors;
    }

    List<IgamtObjectError> checkCoConstraintCell(ResourceSkeleton segment, DataHeaderElementVerified header, TargetLocation cellLocation, CoConstraintCell cell) {
        List<IgamtObjectError> incompatible = Collections.singletonList(this.entry.CoConstraintIncompatibleHeaderAndCellType(
                cellLocation.pathId,
                cellLocation.name,
                segment.getResource().getId(),
                segment.getResource().getType(),
                header.header.getColumnType(),
                cell.getType()
        ));

        switch (header.header.getColumnType()) {
            case CODE:
                if(cell instanceof CodeCell) {
                    return this.checkCodeCell(segment, header, cellLocation, (CodeCell) cell);
                } else {
                    return incompatible;
                }
            case VALUESET:
                if(cell instanceof ValueSetCell) {
                    return this.checkValueSet(segment, header, cellLocation, (ValueSetCell) cell);
                } else {
                    return incompatible;
                }
            case VALUE:
                if(cell instanceof ValueCell) {
                    return this.checkValue(segment, header, cellLocation, (ValueCell) cell);
                } else {
                    return incompatible;
                }
        }
        return this.NoErrors();
    }

    List<IgamtObjectError> checkCodeCell(ResourceSkeleton segment, DataHeaderElementVerified header, TargetLocation cellLocation, CodeCell cell) {
        List<IgamtObjectError> errors = new ArrayList<>();
        if(Strings.isNullOrEmpty(cell.getCode())) {
            errors.add(
                    this.entry.CoConstraintCodeCellMissingCode(
                            cellLocation.pathId,
                            cellLocation.name,
                            segment.getResource().getId(),
                            segment.getResource().getType()
                    )
            );
        }
        if(Strings.isNullOrEmpty(cell.getCodeSystem())) {
            errors.add(
                    this.entry.CoConstraintCodeCellMissingCodeSystem(
                            cellLocation.pathId,
                            cellLocation.name,
                            segment.getResource().getId(),
                            segment.getResource().getType()
                    )
            );
        }
        if(cell.getLocations() == null) {
            errors.add(
                    this.entry.CoConstraintCodeCellMissingBindingLocation(
                            cellLocation.pathId,
                            cellLocation.name,
                            segment.getResource().getId(),
                            segment.getResource().getType()
                    )
            );
        } else {
            List<BindingLocationOption> valid = this.vocabularyBindingVerificationService.getValidBindingLocations(
                    header.target.getResource().getDomainInfo(),
                    header.bindingInfo
            );
            errors.addAll(
                    this.vocabularyBindingVerificationService.verifyBindingLocations(
                            segment,
                            cellLocation.pathId,
                            cellLocation.name,
                            header.target,
                            valid,
                            new HashSet<>(cell.getLocations()),
                            this.entry::CoConstraintCodeCellInvalidBindingLocation
                    )
            );
        }
        return errors;
    }

    List<IgamtObjectError> checkValueSet(ResourceSkeleton segment, DataHeaderElementVerified header, TargetLocation cellLocation, ValueSetCell cell) {
        List<IgamtObjectError> errors = new ArrayList<>();
        List<BindingLocationOption> validLocation = this.vocabularyBindingVerificationService
                .getValidBindingLocations(
                        header.target.getResource().getDomainInfo(),
                        header.bindingInfo
                );
        for(ValuesetBinding vsBinding: cell.getBindings()) {
            errors.addAll(
                    this.vocabularyBindingVerificationService.verifyBindingLocations(
                            segment,
                            cellLocation.pathId,
                            cellLocation.name,
                            header.target,
                            validLocation,
                            vsBinding.getValuesetLocations(),
                            this.entry::CoConstraintValueSetCellInvalidBindingLocation
                    )
            );
            for(String vsId: vsBinding.getValueSets()) {
                if(!this.vocabularyBindingVerificationService.existsValueSet(vsId)) {
                    errors.add(
                            this.entry.ResourceNotFound(
                                    new Location(cellLocation.pathId, cellLocation.name, PropertyType.COCONSTRAINTBINDING_CELL),
                                    vsId,
                                    Type.VALUESET
                            )
                    );
                }
            }
        }
        return errors;
    }

    List<IgamtObjectError> checkValue(ResourceSkeleton segment, DataHeaderElementVerified header, TargetLocation cellLocation, ValueCell cell) {
        if(Strings.isNullOrEmpty(cell.getValue())) {
            return Collections.singletonList(
                    this.entry.CoConstraintValueCellMissingValue(
                            cellLocation.pathId,
                            cellLocation.name,
                            segment.getResource().getId(),
                            segment.getResource().getType()
                    )
            );
        }
        return this.NoErrors();
    }

    DatatypeCellVerified checkDatatypeCell(ResourceSkeleton segment, TargetLocation cellLocation, DataHeaderElementVerified datatype, CoConstraintCell coConstraintCell) {
        if(coConstraintCell instanceof DatatypeCell) {
            List<IgamtObjectError> errors = new ArrayList<>();
            DatatypeCell cell = (DatatypeCell) coConstraintCell;
            if(Strings.isNullOrEmpty(cell.getValue())) {
                // Value Is Missing
            }
            if(Strings.isNullOrEmpty(cell.getDatatypeId())) {
                // Datatype Value Is Missing
                return new DatatypeCellVerified(null, errors);
            } else {
                Datatype dt = this.datatypeService.findById(cell.getDatatypeId());
                if(dt != null) {
                    return new DatatypeCellVerified(dt, errors);
                } else {
                    errors.add(this.entry.ResourceNotFound(
                            new Location(cellLocation.pathId, cellLocation.name, PropertyType.COCONSTRAINTBINDING_CELL),
                            cell.getDatatypeId(),
                            Type.DATATYPE
                    ));
                    return new DatatypeCellVerified(null, errors);
                }
            }
        } else {
            return new DatatypeCellVerified(null, Collections.singletonList(this.entry.CoConstraintIncompatibleHeaderAndCellType(
                    cellLocation.pathId,
                    cellLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType(),
                    datatype.header.getColumnType(),
                    coConstraintCell.getType()
            )));
        }
    }

    List<IgamtObjectError> checkVariesCell(ResourceSkeleton segment, TargetLocation cellLocation, DataHeaderElementVerified varies, Datatype datatype, CoConstraintCell coConstraintCell) {
        if(coConstraintCell instanceof VariesCell) {
            VariesCell cell = (VariesCell) coConstraintCell;
            if(cell.getCellType() != null) {
                BindingInfo bindingInfo = getBindingInfo(datatype.getFixedName());
                DataElementHeader updated = new DataElementHeader();
                updated.setKey(varies.header.getKey());
                updated.setType(HeaderType.DATAELEMENT);
                updated.setColumnType(cell.getCellType());
                List<IgamtObjectError> headerTypeErrors = this.checkDataElementHeaderType(
                        segment.getResource(),
                        varies.target.getLocationInfo(),
                        PropertyType.COCONSTRAINTBINDING_CELL,
                        datatypeService.convertDatatype(datatype),
                        cell.getCellType(),
                        bindingInfo,
                        cellLocation,
                        varies.target.getPosition(),
                        varies.target.getParent()
                );
                if(headerTypeErrors.size() == 0) {
                    DataHeaderElementVerified verified = new DataHeaderElementVerified(
                            updated,
                            varies.target,
                            bindingInfo
                    );
                    return this.checkCoConstraintCell(segment, verified, cellLocation, cell.getCellValue());
                }
                return headerTypeErrors;
            } else {
                return this.NoErrors();
            }
        } else {
            return Collections.singletonList(this.entry.CoConstraintIncompatibleHeaderAndCellType(
                    cellLocation.pathId,
                    cellLocation.name,
                    segment.getResource().getId(),
                    segment.getResource().getType(),
                    varies.header.getColumnType(),
                    coConstraintCell.getType()
            ));
        }
    }


    List<IgamtObjectError> checkDatatypeAndVaries(ResourceSkeleton segment, DataHeaderElementVerified datatype, DataHeaderElementVerified varies, TargetLocation ccLocation, CoConstraint cc) {
        DatatypeCellVerified datatypeCellVerified = checkDatatypeCell(
                segment,
                TargetLocation.makeCellLocation(
                        ccLocation,
                        datatype.header.getKey(),
                        datatype.target.getLocationInfo(),
                        datatype.header.getColumnType()
                ),
                datatype,
                cc.getCells().get(datatype.header.getKey())
        );
        if (datatypeCellVerified.datatype != null) {
            List<IgamtObjectError> errors = new ArrayList<>();
            errors.addAll(
                    this.checkVariesCell(
                            segment,
                            TargetLocation.makeCellLocation(
                                    ccLocation,
                                    varies.header.getKey(),
                                    varies.target.getLocationInfo(),
                                    varies.header.getColumnType()
                            ),
                            varies,
                            datatypeCellVerified.datatype,
                            cc.getCells().get(varies.header.getKey())
                    )
            );
            errors.addAll(
                    datatypeCellVerified.errors
            );
            return errors;
        } else {
            return datatypeCellVerified.errors;
        }
    }

    Map<String, List<IgamtObjectError>> checkCoConstraintHeaders(ResourceSkeleton segment, TargetLocation headersLocation, List<CoConstraintHeader> headers) {
        Map<String, List<IgamtObjectError>> headerIssues = new HashMap<>();
        for(CoConstraintHeader header: headers) {
            if(header instanceof DataElementHeader) {
                List<IgamtObjectError> errors = checkCoConstraintDataElementHeader(
                        segment,
                        headersLocation,
                        (DataElementHeader) header
                );
                if(errors.size() > 0) {
                    headerIssues.put(header.getKey(), errors);
                }
            }
        }
        return headerIssues;
    }

    List<IgamtObjectError> checkCoConstraintDataElementHeader(ResourceSkeleton segment, TargetLocation headersLocation, DataElementHeader dataElementHeader) {
        return this.getTargetAndVerify(
                segment,
                PropertyType.COCONSTRAINTBINDING_HEADER,
                headersLocation.pathId,
                InstancePath.fromString(dataElementHeader.getKey()),
                "Table Header",
                headersLocation.name,
                (headerElement) -> {
                    ResourceSkeletonBone target = (ResourceSkeletonBone) headerElement;
                    BindingInfo bindingInfo = getBindingInfo(target.getResource().getFixedName());
                    return this.checkDataElementHeaderType(
                            segment.getResource(),
                            target.getLocationInfo(),
                            PropertyType.COCONSTRAINTBINDING_HEADER,
                            target.getResource(),
                            dataElementHeader.getColumnType(),
                            bindingInfo,
                            TargetLocation.makeColumnLocation(
                                    headersLocation,
                                    dataElementHeader.getKey(),
                                    target.getLocationInfo(),
                                    dataElementHeader.getColumnType()
                            ),
                            target.getPosition(),
                            target.getParent()
                    );
                }
        );
    }

    List<IgamtObjectError> checkDataElementHeaderType(
            DisplayElement segment,
            LocationInfo locationInfo,
            PropertyType propertyType,
            DisplayElement resource,
            ColumnType type,
            BindingInfo bindingInfo,
            TargetLocation headerLocation,
            int position,
            DisplayElement parent) {
        switch (type) {
            case CODE:
                if(bindingInfo == null || !bindingInfo.isCoded()) {
                    return Collections.singletonList(
                            this.entry.CoConstraintInvalidHeaderType(
                                    headerLocation.pathId,
                                    headerLocation.name,
                                    propertyType,
                                    segment.getId(),
                                    segment.getType(),
                                    locationInfo,
                                    type,
                                    "Target is not a coded element"
                            )
                    );
                }
                break;
            case VALUESET:
                if(bindingInfo == null || !isAllowedLocation(
                        bindingInfo,
                        resource.getDomainInfo().getVersion(),
                        position,
                        locationInfo.getType(),
                        parent.getFixedName())
                ) {
                    return Collections.singletonList(
                            this.entry.CoConstraintInvalidHeaderType(
                                    headerLocation.pathId,
                                    headerLocation.name,
                                    propertyType,
                                    segment.getId(),
                                    segment.getType(),
                                    locationInfo,
                                    type,
                                    "Value Set binding not allowed at location"
                            )
                    );
                }
                break;
            case DATATYPE:
            case VALUE:
                if(!resource.isLeaf()) {
                    return Collections.singletonList(
                            this.entry.CoConstraintInvalidHeaderType(
                                    headerLocation.pathId,
                                    headerLocation.name,
                                    propertyType,
                                    segment.getId(),
                                    segment.getType(),
                                    locationInfo,
                                    type,
                                    "Element must be primitive"
                            )
                    );
                }
                break;
            case VARIES:
                if(!resource.getFixedName().equalsIgnoreCase("varies") && !resource.getFixedName().equalsIgnoreCase("var")) {
                    return Collections.singletonList(
                            this.entry.CoConstraintInvalidHeaderType(
                                    headerLocation.pathId,
                                    headerLocation.name,
                                    propertyType,
                                    segment.getId(),
                                    segment.getType(),
                                    locationInfo,
                                    type,
                                    "Element must have VARIES datatype"
                            )
                    );
                }
                break;
        }
        return this.NoErrors();
    }

    protected static class DatatypeCellVerified {
        Datatype datatype;
        List<IgamtObjectError> errors;

        public DatatypeCellVerified(Datatype datatype, List<IgamtObjectError> errors) {
            this.datatype = datatype;
            this.errors = errors;
        }
    }

    protected static class DataHeaderElementVerified {
        DataElementHeader header;
        ResourceSkeletonBone target;
        BindingInfo bindingInfo;

        public DataHeaderElementVerified(DataElementHeader header, ResourceSkeletonBone target, BindingInfo bindingInfo) {
            this.header = header;
            this.target = target;
            this.bindingInfo = bindingInfo;
        }
    }

    protected static class TargetLocation {
        String pathId;
        String name;

        static String concatPath(String pre, String value) {
            return pre + ">" + value;
        }

        static String concatName(String pre, String value) {
            return pre + " - " + value;
        }

        static TargetLocation makeContextLocation(String pathId, String name) {
            TargetLocation location = new TargetLocation();
            location.name = name;
            location.pathId = pathId;
            return location;
        }

        static TargetLocation makeSegmentLocation(TargetLocation contextLocation, String segmentPathId, String segmentName) {
            TargetLocation location = new TargetLocation();
            location.name = concatName(contextLocation.name, Strings.isNullOrEmpty(contextLocation.name) ? segmentName : segmentName.replace(contextLocation.name + ".", ""));
            location.pathId = concatPath(contextLocation.pathId, segmentPathId);
            return location;
        }

        static TargetLocation makeTableLocation(TargetLocation segmentLocation, String tableId, int i) {
            TargetLocation location = new TargetLocation();
            location.name = concatName(segmentLocation.name, "Table("+i+")");
            location.pathId = concatPath(segmentLocation.pathId, tableId);
            return location;
        }

        static TargetLocation makeGroupLocation(TargetLocation tableLocation, String groupId, int i) {
            TargetLocation location = new TargetLocation();
            location.name = concatName(tableLocation.name, "Group("+i+")");
            location.pathId = concatPath(tableLocation.pathId, groupId);
            return location;
        }

        static TargetLocation makeConditionLocation(TargetLocation tableLocation) {
            TargetLocation location = new TargetLocation();
            location.name = concatName(tableLocation.name, "Condition");
            location.pathId = tableLocation.pathId;
            return location;
        }

        static TargetLocation makeHeadersLocation(TargetLocation tableLocation, String headersKey, String headers) {
            TargetLocation location = new TargetLocation();
            location.name = concatName(tableLocation.name, headers);
            location.pathId = concatPath(tableLocation.pathId, headersKey);
            return location;
        }

        static TargetLocation makeColumnLocation(TargetLocation headersLocation, String key, LocationInfo target, ColumnType columnType) {
            TargetLocation location = new TargetLocation();
            location.name = concatName(headersLocation.name, "Column("+target.getHl7Path()+"[" + columnType +"])");
            location.pathId = concatPath(headersLocation.pathId, key);
            return location;
        }

        static TargetLocation makeRowLocation(TargetLocation tableLocation, String ccId, int i) {
            TargetLocation location = new TargetLocation();
            location.name = concatName(tableLocation.name, "Row(" + i + ")");
            location.pathId = concatPath(tableLocation.pathId, ccId);
            return location;
        }

        static TargetLocation makeCellLocation(TargetLocation rowLocation, String key, LocationInfo target, ColumnType columnType) {
            TargetLocation location = new TargetLocation();
            location.name = concatName(rowLocation.name, "Cell("+target.getHl7Path()+"[" + columnType +"])");
            location.pathId = concatPath(rowLocation.pathId, key);
            return location;
        }
    }
}
