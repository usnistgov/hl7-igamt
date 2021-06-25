package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ProfileComponentsEvaluationResult;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

public interface ConformanceProfileCreationService {

	ProfileComponentsEvaluationResult<ConformanceProfile> create(CompositeProfileStructure structure);
	ProfileComponentsEvaluationResult<Segment> create(Segment target, Set<OrderedProfileComponentLink> structure);

}