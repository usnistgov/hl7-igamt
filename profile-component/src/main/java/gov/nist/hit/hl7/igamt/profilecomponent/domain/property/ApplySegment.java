package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.segment.domain.Segment;

public interface ApplySegment {
	void onSegment(Segment segment);
}
