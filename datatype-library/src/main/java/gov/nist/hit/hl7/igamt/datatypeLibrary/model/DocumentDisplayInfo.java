package gov.nist.hit.hl7.igamt.datatypeLibrary.model;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;

public class DocumentDisplayInfo {

	private DatatypeLibrary ig;
	private Set<DisplayElement> datatypes = new HashSet<DisplayElement>();
	private Set<DisplayElement> valueSets = new HashSet<DisplayElement>();
	
	public DatatypeLibrary getIg() {
		return ig;
	}
	public void setIg(DatatypeLibrary ig) {
		this.ig = ig;
	}

	public Set<DisplayElement> getDatatypes() {
		return datatypes;
	}
	public void setDatatypes(Set<DisplayElement> datatypes) {
		this.datatypes = datatypes;
	}
	public Set<DisplayElement> getValueSets() {
		return valueSets;
	}
	public void setValueSets(Set<DisplayElement> valueSets) {
		this.valueSets = valueSets;
	}
}