package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import java.util.HashMap;
import java.util.Map;

import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public class IGContentMap {

	Map<String,ConformanceProfile> conformanceProfiles = new HashMap<String,ConformanceProfile>();
	Map<String,Segment> segments = new HashMap<String,Segment>();
	Map<String, Datatype> datatypes= new HashMap<String, Datatype>();
	Map<String, Valueset> valuesets= new HashMap<String, Valueset>();
	Map<String,ProfileComponentContext> profileComponents= new HashMap<String,ProfileComponentContext>();
	Map<String,CompositeProfileStructure> compositeProfiles= new HashMap<String,CompositeProfileStructure>();
	
	
	public Map<String, ConformanceProfile> getConformanceProfiles() {
		return conformanceProfiles;
	}
	public void setConformanceProfiles(Map<String, ConformanceProfile> conformanceProfiles) {
		this.conformanceProfiles = conformanceProfiles;
	}
	public Map<String, Segment> getSegments() {
		return segments;
	}
	public void setSegments(Map<String, Segment> segments) {
		this.segments = segments;
	}
	public Map<String, Datatype> getDatatypes() {
		return datatypes;
	}
	public void setDatatypes(Map<String, Datatype> datatypes) {
		this.datatypes = datatypes;
	}
	public Map<String, Valueset> getValuesets() {
		return valuesets;
	}
	public void setValuesets(Map<String, Valueset> valuesets) {
		this.valuesets = valuesets;
	}
	public Map<String, ProfileComponentContext> getProfileComponents() {
		return profileComponents;
	}
	public void setProfileComponents(Map<String, ProfileComponentContext> profileComponents) {
		this.profileComponents = profileComponents;
	}
	public Map<String, CompositeProfileStructure> getCompositeProfiles() {
		return compositeProfiles;
	}
	public void setCompositeProfiles(Map<String, CompositeProfileStructure> compositeProfiles) {
		this.compositeProfiles = compositeProfiles;
	}


	
}
