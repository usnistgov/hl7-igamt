package gov.nist.hit.hl7.igamt.ig.domain.verification;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

import java.util.List;

public class IgVerificationIssuesList {
	private List<DisplayElement> generated;
	private List<IgamtObjectError> ig;
	private List<IgamtObjectError> segments;
	private List<IgamtObjectError> conformanceProfiles;
	private List<IgamtObjectError> datatypes;
	private List<IgamtObjectError> valueSets;
	private List<IgamtObjectError> coConstraintGroups;
	private List<IgamtObjectError> compositeProfiles;

	public List<IgamtObjectError> getIg() {
		return ig;
	}

	public void setIg(List<IgamtObjectError> ig) {
		this.ig = ig;
	}

	public List<IgamtObjectError> getSegments() {
		return segments;
	}

	public void setSegments(List<IgamtObjectError> segments) {
		this.segments = segments;
	}

	public List<IgamtObjectError> getConformanceProfiles() {
		return conformanceProfiles;
	}

	public void setConformanceProfiles(List<IgamtObjectError> conformanceProfiles) {
		this.conformanceProfiles = conformanceProfiles;
	}

	public List<IgamtObjectError> getDatatypes() {
		return datatypes;
	}

	public void setDatatypes(List<IgamtObjectError> datatypes) {
		this.datatypes = datatypes;
	}

	public List<IgamtObjectError> getValueSets() {
		return valueSets;
	}

	public void setValueSets(List<IgamtObjectError> valueSets) {
		this.valueSets = valueSets;
	}

	public List<IgamtObjectError> getCoConstraintGroups() {
		return coConstraintGroups;
	}

	public void setCoConstraintGroups(List<IgamtObjectError> coConstraintGroups) {
		this.coConstraintGroups = coConstraintGroups;
	}

	public List<IgamtObjectError> getCompositeProfiles() {
		return compositeProfiles;
	}

	public void setCompositeProfiles(List<IgamtObjectError> compositeProfiles) {
		this.compositeProfiles = compositeProfiles;
	}

	public List<DisplayElement> getGenerated() {
		return generated;
	}

	public void setGenerated(List<DisplayElement> generated) {
		this.generated = generated;
	}
}
