package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import java.util.HashMap;
import java.util.Map;

import gov.nist.hit.hl7.igamt.compositeprofile.model.CompositeProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public class IGContentMap {

	Map<String,ConformanceProfile> conformanceProfiles = new HashMap<String,ConformanceProfile>();
	Map<String,Segment> segments = new HashMap<String,Segment>();
	Map<String, Datatype> datatypes= new HashMap<String, Datatype>();
	Map<String, Valueset> valuesets= new HashMap<String, Valueset>();
	Map<String,ProfileComponent> profileComponents= new HashMap<String,ProfileComponent>();
	Map<String,CompositeProfile> compositeProfiles= new HashMap<String,CompositeProfile>();
	
	
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
	public Map<String, ProfileComponent> getProfileComponents() {
		return profileComponents;
	}
	public void setProfileComponents(Map<String, ProfileComponent> profileComponents) {
		this.profileComponents = profileComponents;
	}
	public Map<String, CompositeProfile> getCompositeProfiles() {
		return compositeProfiles;
	}
	public void setCompositeProfiles(Map<String, CompositeProfile> compositeProfiles) {
		this.compositeProfiles = compositeProfiles;
	}


	
}
