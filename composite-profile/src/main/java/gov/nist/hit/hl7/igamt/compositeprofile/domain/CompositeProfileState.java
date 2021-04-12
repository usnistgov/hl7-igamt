package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

import java.util.List;

public class CompositeProfileState {
    ResourceAndDisplay<ConformanceProfile> conformanceProfile;
    List<ResourceAndDisplay<Datatype>> datatypes;
    List<ResourceAndDisplay<Segment>> segments;

    public ResourceAndDisplay<ConformanceProfile> getConformanceProfile() {
        return conformanceProfile;
    }

    public void setConformanceProfile(ResourceAndDisplay<ConformanceProfile> conformanceProfile) {
        this.conformanceProfile = conformanceProfile;
    }

    public List<ResourceAndDisplay<Datatype>> getDatatypes() {
        return datatypes;
    }

    public void setDatatypes(List<ResourceAndDisplay<Datatype>> datatypes) {
        this.datatypes = datatypes;
    }

    public List<ResourceAndDisplay<Segment>> getSegments() {
        return segments;
    }

    public void setSegments(List<ResourceAndDisplay<Segment>> segments) {
        this.segments = segments;
    }
}
