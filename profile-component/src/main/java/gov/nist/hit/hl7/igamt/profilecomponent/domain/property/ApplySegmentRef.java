package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;

public interface ApplySegmentRef {
    void onSegmentRef(SegmentRef segmentRef);
}
