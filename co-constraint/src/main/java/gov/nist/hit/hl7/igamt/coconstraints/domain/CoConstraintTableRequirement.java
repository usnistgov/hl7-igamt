package gov.nist.hit.hl7.igamt.coconstraints.domain;

public class CoConstraintTableRequirement {
	
	private CoConstraintUsage usage;
	private CoConstraintCard cardinality;
	
	public CoConstraintUsage getUsage() {
		return usage;
	}
	public void setUsage(CoConstraintUsage usage) {
		this.usage = usage;
	}
	public CoConstraintCard getCardinality() {
		return cardinality;
	}
	public void setCardinality(CoConstraintCard cardinality) {
		this.cardinality = cardinality;
	}
	
	public CoConstraintTableRequirement clone(){
		CoConstraintTableRequirement req = new CoConstraintTableRequirement();
		req.cardinality = this.cardinality.clone();
		return req;
	}

}
