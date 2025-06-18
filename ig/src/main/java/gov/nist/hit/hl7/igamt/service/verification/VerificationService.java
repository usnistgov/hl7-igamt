package gov.nist.hit.hl7.igamt.service.verification;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CompositeProfileVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgVerificationIssuesList;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

import java.util.List;


public interface VerificationService {
	List<IgamtObjectError> verifySegment(Segment segment);
	List<IgamtObjectError> verifyDatatype(Datatype datatype);
	List<IgamtObjectError> verifyValueSet(Valueset valueSet);
	List<IgamtObjectError> verifyConformanceProfile(ConformanceProfile conformanceProfile);
	CompositeProfileVerificationResult verifyCompositeProfile(CompositeProfileStructure compositeProfileStructure);
	IgVerificationIssuesList verifyIg(Ig ig);
	List<IgamtObjectError> verifyCoConstraintGroup(CoConstraintGroup coConstraintGroup);
	IgVerificationIssuesList verify(
			Ig ig,
			List<CompositeProfileStructure> compositeProfiles,
			List<ConformanceProfile> conformanceProfiles,
			List<Segment> segments,
			List<Datatype> datatypes,
			List<Valueset> valueSets,
			List<CoConstraintGroup> coConstraintGroups
	);
}
