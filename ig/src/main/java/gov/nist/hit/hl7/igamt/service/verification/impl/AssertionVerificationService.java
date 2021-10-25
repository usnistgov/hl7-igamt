package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.*;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement.ComplementKey;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import org.springframework.stereotype.Service;

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
                (context) -> this.checkAssertion(context, location, assertion.getChild())
        );
    }

    public List<IgamtObjectError> checkSingleAssertion(ResourceSkeleton skeleton, Location location, SingleAssertion assertion) {
        List<IgamtObjectError> issues = this.getTargetOrFailAndVerify(
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
                            return Collections.singletonList(
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
                    return this.NoErrors();
                }
        );

        if(assertion.getComplement().getPath() != null) {
            issues.addAll(
                    this.getTargetOrFailAndVerify(
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
                                return this.NoErrors();
                            }
                    )
            );
        }
        return issues;
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
