package gov.nist.hit.hl7.igamt.ig.service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

import java.util.List;
import java.util.Set;

public interface ResourceBindingVerificationService {

    List<IgamtObjectError> verifySegmentBindings(Segment segment);
    List<IgamtObjectError> verifyDatatypeBindings(Datatype datatype);
    List<IgamtObjectError> verifyConformanceProfileBindings(ConformanceProfile conformanceProfile);

    List<IgamtObjectError> verifyValueSetBinding(ResourceSkeleton resourceSkeleton, String pathId, Set<ValuesetBinding> valuesetBinding);
    List<IgamtObjectError> verifySingleCodeBinding(ResourceSkeleton resourceSkeleton, String pathId, InternalSingleCode internalSingleCode);
    List<IgamtObjectError> verifyPredicateBinding(ResourceSkeleton resourceSkeleton, String pathId, Predicate predicate);
    List<IgamtObjectError> verifyConformanceStatementBinding(ResourceSkeleton resourceSkeleton, String csId, ConformanceStatement conformanceStatement);
    List<IgamtObjectError> verifyCoConstraintBinding(ResourceSkeleton resourceSkeleton, CoConstraintBinding coConstraintBinding);

}
