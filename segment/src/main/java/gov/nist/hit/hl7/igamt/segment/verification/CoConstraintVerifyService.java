package gov.nist.hit.hl7.igamt.segment.verification;

import java.util.Map;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

public interface CoConstraintVerifyService {

	public Map<String, String> verify(CoConstraintTable cc, Segment segment);

}
