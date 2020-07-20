package gov.nist.hit.hl7.igamt.coconstraints.model;

import java.util.Objects;

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

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		CoConstraintCardinality that = (CoConstraintCardinality) o;
		return min == that.min &&
				Objects.equals(max, that.max);
	}

	@Override
	public int hashCode() {
		return Objects.hash(min, max);
	}
}
