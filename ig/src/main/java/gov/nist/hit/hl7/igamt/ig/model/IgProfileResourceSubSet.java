package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

import java.util.ArrayList;
import java.util.List;

public class IgProfileResourceSubSet {
	List<ConformanceProfile> conformanceProfiles = new ArrayList<>();
	List<CompositeProfileStructure> compositeProfiles = new ArrayList<>();
	List<Segment> segments = new ArrayList<>();
	List<Datatype> datatypes = new ArrayList<>();
	List<Valueset> valuesets = new ArrayList<>();

	public List<ConformanceProfile> getConformanceProfiles() {
		return conformanceProfiles;
	}

	public void setConformanceProfiles(List<ConformanceProfile> conformanceProfiles) {
		this.conformanceProfiles = conformanceProfiles;
	}

	public List<Segment> getSegments() {
		return segments;
	}

	public void setSegments(List<Segment> segments) {
		this.segments = segments;
	}

	public List<Datatype> getDatatypes() {
		return datatypes;
	}

	public void setDatatypes(List<Datatype> datatypes) {
		this.datatypes = datatypes;
	}

	public List<Valueset> getValuesets() {
		return valuesets;
	}

	public void setValuesets(List<Valueset> valuesets) {
		this.valuesets = valuesets;
	}

	public List<CompositeProfileStructure> getCompositeProfiles() {
		return compositeProfiles;
	}

	public void setCompositeProfiles(List<CompositeProfileStructure> compositeProfiles) {
		this.compositeProfiles = compositeProfiles;
	}
}
