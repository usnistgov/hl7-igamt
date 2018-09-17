package gov.nist.hit.hl7.igamt.coconstraints.domain;

import java.util.ArrayList;
import java.util.List;

public class CoConstraintTableContent {
	
	private List<CoConstraintTableRow> free;
	private List<CoConstraintTableGroup> groups;
	
	public List<CoConstraintTableRow> getFree() {
		return free;
	}
	public void setFree(List<CoConstraintTableRow> free) {
		this.free = free;
	}
	public List<CoConstraintTableGroup> getGroups() {
		return groups;
	}
	public void setGroups(List<CoConstraintTableGroup> groups) {
		this.groups = groups;
	}
	
	public CoConstraintTableContent clone(){
		CoConstraintTableContent clone = new CoConstraintTableContent();
		clone.free = new ArrayList<>(free);
		clone.groups = new ArrayList<>(groups);
		return clone;
	}
}
