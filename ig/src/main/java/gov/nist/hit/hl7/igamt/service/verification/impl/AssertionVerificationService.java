package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.*;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement.ComplementKey;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AssertionVerificationService extends VerificationUtils {

    private final Set<String> TEMPORAL_DT = new HashSet<>(Arrays.asList("DT", "DTM", "TM"));
    private final Set<String> NUMERICAL_DT = new HashSet<>(Arrays.asList("NM", "SI"));

    public List<IgamtObjectError> checkAssertion(ResourceSkeleton skeleton, Location location, Assertion assertion) {
        switch (assertion.getMode()) {
            case SIMPLE:
                return this.checkSingleAssertion(skeleton, location, (SingleAssertion) assertion);
            case IFTHEN:
                return this.checkIfThenAssertion(skeleton, location, (IfThenAssertion) assertion);
            case ANDOR:
                return this.checkOperatorAssertion(skeleton, location, (OperatorAssertion) assertion);
            case NOT:
                return this.checkNotAssertion(skeleton, location, (NotAssertion) assertion);
            case SUBCONTEXT:
                return this.checkSubContextAssertion(skeleton, location, (SubContextAssertion) assertion);
        }
        return null;
    }

    public List<IgamtObjectError> checkIfThenAssertion(ResourceSkeleton skeleton, Location location, IfThenAssertion assertion) {
        return Stream.concat(
                this.checkAssertion(skeleton, location, assertion.getIfAssertion()).stream(),
                this.checkAssertion(skeleton, location, assertion.getThenAssertion()).stream()
        ).collect(Collectors.toList());
    }

    public List<IgamtObjectError> checkNotAssertion(ResourceSkeleton skeleton, Location location, NotAssertion assertion) {
        return this.checkAssertion(skeleton, location, assertion.getChild());
    }

    public List<IgamtObjectError> checkOperatorAssertion(ResourceSkeleton skeleton, Location location, OperatorAssertion assertion) {
        return assertion.getAssertions().stream()
                .flatMap((a) -> this.checkAssertion(skeleton, location, a).stream())
                .collect(Collectors.toList());

    }

    public List<IgamtObjectError> checkSubContextAssertion(ResourceSkeleton skeleton, Location location, SubContextAssertion assertion) {

        return this.getTargetAndVerify(
                skeleton,
                null,
                null,
                assertion.getContext().getPath(),
                null,
                "SubContext",
                (context) -> {
                    List<IgamtObjectError> issues = new ArrayList<>();
                    issues.addAll(
                            this.checkOccurrences(
                                    context,
                                    skeleton,
                                    location,
                                    assertion.getContext().getOccurenceType(),
                                    assertion.getContext().getOccurenceValue()
                            )
                    );
                    issues.addAll(this.checkAssertion(context, location, assertion.getChild()));
                    return issues;
                }
        );
    }

    public List<IgamtObjectError> checkOccurrences(ResourceSkeleton subject, ResourceSkeleton context, Location location, String occurrenceType, int occurrenceValue) {
        int max = this.getMaxRepeat(subject, context);
        int multi = this.getMultiLevelRepeat(subject, context);

        if(!Strings.isNullOrEmpty(occurrenceType)) {
            if (max <= 1) {
                // No Repeat Allowed
                return Arrays.asList(
                        this.entry.AssertionOccurrenceTypeOnNotRepeatable(
                                location,
                                subject.getResource().getId(),
                                subject.getResource().getType(),
                                ((ResourceSkeletonBone) subject).getLocationInfo(),
                                occurrenceType,
                                ((ResourceSkeletonBone) subject).getLocationInfo().getName()
                        )
                );
            }

            if (multi > 1 && occurrenceType.equals("instance")) {
                // Instance not allowed on multi level repeat
                return Arrays.asList(
                        this.entry.AssertionOccurrenceTypeInstanceOnNotMultiLevelRepeatable(
                                location,
                                subject.getResource().getId(),
                                subject.getResource().getType(),
                                ((ResourceSkeletonBone) subject).getLocationInfo(),
                                ((ResourceSkeletonBone) subject).getLocationInfo().getName()
                        )
                );
            }

            if (occurrenceValue > max) {
                // Over max
                return Arrays.asList(
                        this.entry.AssertionOccurrenceValueOverMax(
                                location,
                                subject.getResource().getId(),
                                subject.getResource().getType(),
                                ((ResourceSkeletonBone) subject).getLocationInfo(),
                                occurrenceType,
                                max,
                                occurrenceValue,
                                ((ResourceSkeletonBone) subject).getLocationInfo().getName()
                        )
                );
            }
        } else {
            if(max > 1) {
                return Arrays.asList(
                        this.entry.AssertionOccurrenceTypeMissing(
                                location,
                                subject.getResource().getId(),
                                subject.getResource().getType(),
                                ((ResourceSkeletonBone) subject).getLocationInfo(),
                                occurrenceType,
                                ((ResourceSkeletonBone) subject).getLocationInfo().getName()
                        )
                );
            }
        }



        return this.NoErrors();
    }

    public List<IgamtObjectError> checkSingleAssertion(ResourceSkeleton skeleton, Location location, SingleAssertion assertion) {
        return this.getTargetOrFailAndVerify(
                skeleton,
                location.getProperty(),
                location.getPathId(),
                location.getName(),
                assertion.getSubject().getPath(),
                "Assertion Subject",
                (subject) -> {
                    List<IgamtObjectError> issues = new ArrayList<>();

                    // Assertion is a presence check
                    boolean isPresenceCheck = Arrays.asList(ComplementKey.valued, ComplementKey.notValued)
                            .contains(assertion.getComplement().getComplementKey());
                    // Assertion is a comparison
                    boolean isComparison = assertion.getComplement().getComplementKey().isComparison();
                    // Subject is primitive
                    boolean subjectIsPrimitive = subject.getResource().isLeaf();

                    if (!isPresenceCheck && !subjectIsPrimitive) {
                        // Subject should be primitive

                            issues.add(
                                this.entry.PathShouldBePrimitive(
                                        location,
                                        subject.getResource().getId(),
                                        subject.getResource().getType(),
                                        ((ResourceSkeletonBone) subject).getLocationInfo(),
                                        ((ResourceSkeletonBone) subject).getLocationInfo().getName()
                                )
                            );

                    }

                    // Check Subject Occurrence Type
                    issues.addAll(
                            this.checkOccurrences(subject, skeleton, location, assertion.getSubject().getOccurenceType(), assertion.getSubject().getOccurenceValue())
                    );

                    // Check Assertion
                    if(!isComparison) {
                        issues.addAll(
                                this.checkSingleAssertionDeclarativeContent(subject, location, assertion)
                        );
                    } else {
                        if (assertion.getComplement().getPath() != null) {
                            issues.addAll(
                                    this.checkComparison(skeleton, (ResourceSkeletonBone) subject, location, assertion)
                            );
                        } else {
                            issues.add(
                                    this.entry.AssertionComparisonPathMissing(
                                            location,
                                            subject.getResource().getId(),
                                            subject.getResource().getType()
                                    )
                            );
                        }
                    }

                    return issues;
                }
        );
    }

    private List<IgamtObjectError> checkComparison(ResourceSkeleton skeleton, ResourceSkeletonBone subject, Location location, SingleAssertion assertion) {
        ComplementKey key = assertion.getComplement().getComplementKey();
        return this.getTargetOrFailAndVerify(
                skeleton,
                location.getProperty(),
                location.getPathId(),
                location.getName(),
                assertion.getComplement().getPath(),
                "Assertion Complement",
                (target) -> {
                    List<IgamtObjectError> issues = new ArrayList<>();
                    ResourceSkeletonBone complement = (ResourceSkeletonBone) target;
                    boolean subjectIsPrimitive = subject.getResource().isLeaf();
                    boolean complementIsPrimitive = complement.getResource().isLeaf();
                    String subjectDT = subject.getResource().getResourceName();
                    String complementDT = complement.getResource().getResourceName();

                    if (!complementIsPrimitive) {
                        issues.add(
                                this.entry.PathShouldBePrimitive(
                                        location,
                                        complement.getResource().getId(),
                                        complement.getResource().getType(),
                                        complement.getLocationInfo(),
                                        complement.getLocationInfo().getName()
                                )
                        );
                    } else if(subjectIsPrimitive) {

                        // Using DateTime comparator with incompatible datatypes
                        if(key.isDateTime() && (!TEMPORAL_DT.contains(subjectDT) || !TEMPORAL_DT.contains(complementDT))) {
                            issues.add(this.entry.AssertionComparisonDateTimeIncompatible(
                                    location,
                                    subject.getResource().getId(),
                                    subject.getResource().getType(),
                                    subject.getLocationInfo(),
                                    subjectDT,
                                    complement.getLocationInfo(),
                                    complementDT
                            ));
                        }

                        // Check if only one is numerical
                        boolean incompatibleNumerical = Stream.of(subjectDT, complementDT)
                                .filter(NUMERICAL_DT::contains).count() == 1;
                        // Check if only one is temporal
                        boolean incompatibleTemporal = Stream.of(subjectDT, complementDT)
                                .filter(TEMPORAL_DT::contains).count() == 1;


                        if(incompatibleNumerical || incompatibleTemporal) {
                            issues.add(this.entry.AssertionComparisonIncompatible(
                                    location,
                                    subject.getResource().getId(),
                                    subject.getResource().getType(),
                                    subject.getLocationInfo(),
                                    subjectDT,
                                    complement.getLocationInfo(),
                                    complementDT
                            ));
                        }
                    }

                    // Check Occurrence type
                    issues.addAll(
                            this.checkOccurrences(complement, skeleton, location, assertion.getComplement().getOccurenceType(), assertion.getComplement().getOccurenceValue())
                    );

                    return issues;
                }
        );
    }

    private List<IgamtObjectError> checkSingleAssertionDeclarativeContent(ResourceSkeleton subject, Location location, SingleAssertion assertion) {
        List<IgamtObjectError> issues = new ArrayList<>();
        ComplementKey key = assertion.getComplement().getComplementKey();

        // Declaration Type Requires CodeSys and CodeSys is empty
        if(key.isCodeSys() && Strings.isNullOrEmpty(assertion.getComplement().getCodesys())) {
            issues.add(this.entry.AssertionCodeSysMissing(
                    location,
                    subject.getResource().getId(),
                    subject.getResource().getType()
            ));
        }

        if(key.isMulti()) {
            boolean empty = assertion.getComplement().getValues() == null || assertion.getComplement().getValues().length == 0;
            // Declaration Type Requires Value List and Value List is empty
            if(key.isValue()) {
                boolean emptyOrContainsEmpty = empty || Arrays.stream(assertion.getComplement().getValues()).anyMatch(Strings::isNullOrEmpty);
                if(emptyOrContainsEmpty) {
                    issues.add(this.entry.AssertionValueMissing(
                            location,
                            subject.getResource().getId(),
                            subject.getResource().getType(),
                            true
                    ));
                }
            }

            // Declaration Type Requires Description
            if(key.isDescription() && !empty) {
                // Description List is null or empty
                boolean nullOrEmpty = assertion.getComplement().getDescs() == null || assertion.getComplement().getDescs().length == 0;
                // Description List doesn't contain a description per value
                boolean notSameNumberAsValues = nullOrEmpty || assertion.getComplement().getDescs().length != assertion.getComplement().getValues().length;
                // Description List contains empty value
                boolean containsEmpty = nullOrEmpty || Arrays.stream(assertion.getComplement().getDescs()).anyMatch(Strings::isNullOrEmpty);

                // If one or more of the above, then consider that description is missing
                if(nullOrEmpty || notSameNumberAsValues || containsEmpty) {
                    issues.add(this.entry.AssertionDescriptionMissing(
                            location,
                            subject.getResource().getId(),
                            subject.getResource().getType(),
                            true
                    ));
                }
            }

        } else {

            // Declaration Type Requires Value but its missing
            if(key.isValue() && Strings.isNullOrEmpty(assertion.getComplement().getValue())) {
                issues.add(this.entry.AssertionValueMissing(
                        location,
                        subject.getResource().getId(),
                        subject.getResource().getType(),
                        false
                ));
            }

            // Declaration Type Requires Description but its missing
            if(key.isDescription() && Strings.isNullOrEmpty(assertion.getComplement().getDesc())) {
                issues.add(this.entry.AssertionDescriptionMissing(
                        location,
                        subject.getResource().getId(),
                        subject.getResource().getType(),
                        false
                ));
            }
        }
        return issues;
    }

    private int getMaxRepeat(ResourceSkeleton skeleton, ResourceSkeleton context) {
        if(skeleton instanceof ResourceSkeletonBone && skeleton != context) {
            ResourceSkeletonBone bone = (ResourceSkeletonBone) skeleton;
            if(bone.getCardinality() != null) {
                if(bone.getCardinality().getMax().equals("*")) {
                    return Integer.MAX_VALUE;
                } else {
                    try {
                        int max = Integer.parseInt(bone.getCardinality().getMax());
                        return max * getMaxRepeat(bone.getParentSkeleton(), context);
                    } catch (Exception e) {
                        return 1;
                    }
                }
            } else {
                return getMaxRepeat(bone.getParentSkeleton(), context);
            }
        }
        return 1;
    }

    private int getMultiLevelRepeat(ResourceSkeleton skeleton, ResourceSkeleton context) {
        if(skeleton instanceof ResourceSkeletonBone && skeleton != context) {
            ResourceSkeletonBone bone = (ResourceSkeletonBone) skeleton;
            if(bone.getCardinality() != null) {
                if(bone.getCardinality().getMax().equals("*")) {
                    return 1 + getMultiLevelRepeat(bone.getParentSkeleton(), context);
                }  else {
                    try {
                        int max = Integer.parseInt(bone.getCardinality().getMax());
                        if(max > 1) {
                            return 1 + getMultiLevelRepeat(bone.getParentSkeleton(), context);
                        } else {
                            return getMultiLevelRepeat(bone.getParentSkeleton(), context);
                        }
                    } catch (Exception e) {
                        return getMultiLevelRepeat(bone.getParentSkeleton(), context);
                    }
                }
            } else {
                return getMultiLevelRepeat(bone.getParentSkeleton(), context);
            }
        }
        return 0;
    }

    protected String pathId(Location location) {
        return location != null ? location.getPathId() : null;
    }

    protected PropertyType propertyType(Location location) {
        return location != null ? location.getProperty() : null;
    }

    protected LocationInfo info(Location location) {
        return location != null ? location.getInfo() : null;
    }
}
