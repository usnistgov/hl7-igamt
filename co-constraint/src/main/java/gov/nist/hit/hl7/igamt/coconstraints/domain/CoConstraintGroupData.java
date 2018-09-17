package gov.nist.hit.hl7.igamt.coconstraints.domain;

public class CoConstraintGroupData {
	
	private String name;
	private CoConstraintTableRequirement requirements;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public CoConstraintTableRequirement getRequirements() {
		return requirements;
	}
	public void setRequirements(CoConstraintTableRequirement requirements) {
		this.requirements = requirements;
	}
	
	public CoConstraintGroupData clone(){
		CoConstraintGroupData data = new CoConstraintGroupData();
		data.name = name;
		data.requirements = requirements.clone();
		return data;
	}
	
}
