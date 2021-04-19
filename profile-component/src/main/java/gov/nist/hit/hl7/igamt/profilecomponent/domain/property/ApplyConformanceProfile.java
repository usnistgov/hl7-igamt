package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;

public interface ApplyConformanceProfile {

    void onConformanceProfile(ConformanceProfile cp);
}
