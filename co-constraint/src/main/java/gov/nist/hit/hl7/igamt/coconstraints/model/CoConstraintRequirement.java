package gov.nist.hit.hl7.igamt.coconstraints.model;


public class CoConstraintRequirement {
	
	private CoConstraintUsage usage;
	private CoConstraintCardinality cardinality;
	
	public CoConstraintUsage getUsage() {
		return usage;
	}
	public void setUsage(CoConstraintUsage usage) {
		this.usage = usage;
	}
	public CoConstraintCardinality getCardinality() {
		return cardinality;
	}
	public void setCardinality(CoConstraintCardinality cardinality) {
		this.cardinality = cardinality;
	}
	
	public CoConstraintRequirement clone(){
		CoConstraintRequirement req = new CoConstraintRequirement();
		req.cardinality = this.cardinality.clone();
		return req;
	}

}
