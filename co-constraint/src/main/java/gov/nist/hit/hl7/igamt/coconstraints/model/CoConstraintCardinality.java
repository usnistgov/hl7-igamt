package gov.nist.hit.hl7.igamt.coconstraints.model;

public class CoConstraintCardinality {

	private int min;
	private String max;
	
	public int getMin() {
		return min;
	}
	public void setMin(int min) {
		this.min = min;
	}
	public String getMax() {
		return max;
	}
	public void setMax(String max) {
		this.max = max;
	}
	
	public CoConstraintCardinality clone(){
		CoConstraintCardinality clone = new CoConstraintCardinality();
		clone.min = min;
		clone.max = max;
		return clone;
	}

}
