package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.service.TriFunction;
import gov.nist.hit.hl7.igamt.common.base.domain.ConstraintType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.binding.*;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingVerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SimpleResourceBindingVerificationService extends VerificationUtils implements ResourceBindingVerificationService {

    @Autowired
    AssertionVerificationService assertionVerificationService;
    @Autowired
    VocabularyBindingVerificationService vocabularyBindingVerificationService;
    @Autowired
    ResourceBindingService resourceBindingService;
    @Autowired
    ResourceSkeletonService resourceSkeletonService;

    @Override
    public List<IgamtObjectError> verifySegmentBindings(Segment segment) {
        return this.verifyResourceBindings(
            segment.getId(),
            segment.getType(),
            segment.getBinding()
        );
    }

    @Override
    public List<IgamtObjectError> verifyDatatypeBindings(Datatype datatype) {
        return this.verifyResourceBindings(
                datatype.getId(),
                datatype.getType(),
                datatype.getBinding()
        );
    }

    @Override
    public List<IgamtObjectError> verifyConformanceProfileBindings(ConformanceProfile conformanceProfile) {
        return this.verifyResourceBindings(
                conformanceProfile.getId(),
                conformanceProfile.getType(),
                conformanceProfile.getBinding()
        );
    }

    public List<IgamtObjectError> verifyResourceBindings(String id, Type type, ResourceBinding resourceBinding) {
        ResourceSkeleton resourceSkeleton = new ResourceSkeleton(
                new ResourceRef(type, id),
                this.resourceSkeletonService
        );
        FlatResourceBinding flatResourceBindings = this.resourceBindingService.getFlatResourceBindings(resourceBinding);
        List<IgamtObjectError> issues = new ArrayList<>();
        issues.addAll(this.checkBindings(flatResourceBindings.getSingleCodeBindingContainers(), resourceSkeleton, this::verifySingleCodeBinding));
        issues.addAll(this.checkBindings(flatResourceBindings.getValueSetBindingContainers(), resourceSkeleton, this::verifyValueSetBinding));
        issues.addAll(this.checkBindings(flatResourceBindings.getPredicateBindingContainers(), resourceSkeleton, this::verifyPredicateBinding));
        issues.addAll(this.checkBindings(flatResourceBindings.getConformanceStatementBindingContainers(), resourceSkeleton, this::verifyConformanceStatementBinding));
        return issues;
    }

    private <T, E extends BindingContainer<T>> List<IgamtObjectError> checkBindings(Set<E> bindings,  ResourceSkeleton resourceSkeleton, TriFunction<ResourceSkeleton, String, T, List<IgamtObjectError>> verify) {
        return bindings.stream().flatMap(
                (bindingContainer) -> verify.apply(resourceSkeleton, bindingContainer.getPathId(), bindingContainer.getValue()).stream()
        ).collect(Collectors.toList());
    }

    @Override
    public List<IgamtObjectError> verifyValueSetBinding(ResourceSkeleton resourceSkeleton, String pathId, Set<ValuesetBinding> valuesetBinding) {
        return this.vocabularyBindingVerificationService.verifyValueSetBinding(resourceSkeleton, pathId, valuesetBinding);
    }

    @Override
    public List<IgamtObjectError> verifySingleCodeBinding(ResourceSkeleton resourceSkeleton, String pathId, InternalSingleCode internalSingleCode) {
        return this.vocabularyBindingVerificationService.verifySingleCodeBinding(resourceSkeleton, pathId, internalSingleCode);
    }

    @Override
    public List<IgamtObjectError> verifyPredicateBinding(ResourceSkeleton resourceSkeleton, String pathId, Predicate predicate) {
        return this.process(
                resourceSkeleton,
                PropertyType.PREDICATE,
                pathId,
                (target) -> this.getTargetAndVerify(
                        resourceSkeleton,
                        PropertyType.PREDICATE,
                        pathId,
                        predicate.getContext(),
                        "Predicate Context",
                        (context) -> {
                            if(predicate.getType().equals(ConstraintType.ASSERTION)) {
                                return this.assertionVerificationService.checkAssertion(
                                        context,
                                        new Location(
                                                pathId,
                                                target.getLocationInfo(),
                                                PropertyType.PREDICATE
                                        ),
                                        ((AssertionPredicate) predicate).getAssertion()
                                );
                            } else {
                                return this.NoErrors();
                            }
                        }
                )
        );
    }

    @Override
    public List<IgamtObjectError> verifyConformanceStatementBinding(ResourceSkeleton resourceSkeleton, String csId, ConformanceStatement conformanceStatement) {
        return this.getTargetAndVerify(
                resourceSkeleton,
                PropertyType.STATEMENT,
                csId,
                conformanceStatement.getContext(),
                "Conformance Statement Context",
                (context) -> {
                    if(conformanceStatement.getType().equals(ConstraintType.ASSERTION)) {
                        return this.assertionVerificationService.checkAssertion(
                                context,
                                new Location(
                                        csId,
                                        null,
                                        PropertyType.STATEMENT
                                ),
                                ((AssertionConformanceStatement) conformanceStatement).getAssertion()
                        );
                    } else {
                        return this.NoErrors();
                    }
                }
        );
    }

    @Override
    public List<IgamtObjectError> verifyCoConstraintBinding(ResourceSkeleton resourceSkeleton, CoConstraintBinding coConstraintBinding) {
        return null;
    }

}
