package gov.nist.hit.hl7.igamt.display.model;

import java.util.Set;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;

public class IGDisplayInfo {

	private Ig ig;
	private Set<DisplayElement> messages;
	private Set<DisplayElement> segments;
	private Set<DisplayElement> datatypes;
	private Set<DisplayElement> valueSets;
	
	
	public Ig getIg() {
		return ig;
	}
	public void setIg(Ig ig) {
		this.ig = ig;
	}
	public Set<DisplayElement> getMessages() {
		return messages;
	}
	public void setMessages(Set<DisplayElement> messages) {
		this.messages = messages;
	}
	public Set<DisplayElement> getSegments() {
		return segments;
	}
	public void setSegments(Set<DisplayElement> segments) {
		this.segments = segments;
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
