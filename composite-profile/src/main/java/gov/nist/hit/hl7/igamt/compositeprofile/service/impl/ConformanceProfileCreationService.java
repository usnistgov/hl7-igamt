package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ProfileComponentsEvaluationResult;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;

public interface ConformanceProfileCreationService {

	ProfileComponentsEvaluationResult<ConformanceProfile> create(CompositeProfileStructure structure) throws Exception;

}