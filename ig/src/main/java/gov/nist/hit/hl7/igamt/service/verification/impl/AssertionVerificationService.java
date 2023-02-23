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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AssertionVerificationService extends VerificationUtils {

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

        if(max <= 1) {
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

        if(multi > 1 && occurrenceType.equals("instance")) {
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

        if(occurrenceValue > max) {
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

        return this.NoErrors();
    }

    public List<IgamtObjectError> checkSingleAssertion(ResourceSkeleton skeleton, Location location, SingleAssertion assertion) {
        List<IgamtObjectError> issues = new ArrayList<>();
        issues.addAll(this.getTargetOrFailAndVerify(
                skeleton,
                location.getProperty(),
                location.getPathId(),
                location.getName(),
                assertion.getSubject().getPath(),
                "Assertion Subject",
                (subject) -> {
                    if(!Arrays.asList(ComplementKey.valued, ComplementKey.notValued)
                            .contains(assertion.getComplement().getComplementKey())) {
                        if(!subject.getResource().isLeaf() && subject instanceof ResourceSkeletonBone) {
                            return Arrays.asList(
                                    this.entry.PathShouldBePrimitive(
                                            location,
                                            subject.getResource().getId(),
                                            subject.getResource().getType(),
                                            ((ResourceSkeletonBone) subject).getLocationInfo(),
                                            ((ResourceSkeletonBone) subject).getLocationInfo().getName()
                                    )
                            );
                        }
                    }

                    if(!Strings.isNullOrEmpty(assertion.getSubject().getOccurenceType())) {
                        return this.checkOccurrences(subject, skeleton, location, assertion.getSubject().getOccurenceType(), assertion.getSubject().getOccurenceValue());
                    }
                    return this.NoErrors();
                }
        ));

        if(assertion.getComplement().getPath() != null) {
            issues.addAll(this.getTargetOrFailAndVerify(
                            skeleton,
                            location.getProperty(),
                            location.getPathId(),
                            location.getName(),
                            assertion.getComplement().getPath(),
                            "Assertion Complement",
                            (complement) -> {
                                if(!complement.getResource().isLeaf()) {
                                    return Collections.singletonList(
                                            this.entry.PathShouldBePrimitive(
                                                    location,
                                                    complement.getResource().getId(),
                                                    complement.getResource().getType(),
                                                    ((ResourceSkeletonBone) complement).getLocationInfo(),
                                                    ((ResourceSkeletonBone) complement).getLocationInfo().getName()
                                            )
                                    );
                                }
                                if(!Strings.isNullOrEmpty(assertion.getComplement().getOccurenceType())) {
                                    return this.checkOccurrences(complement, skeleton, location, assertion.getComplement().getOccurenceType(), assertion.getComplement().getOccurenceValue());
                                }
                                return this.NoErrors();
                            }
                    )
            );
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
