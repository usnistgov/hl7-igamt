package gov.nist.hit.hl7.igamt.coconstraints.model;


public class CoConstraintRequirement extends WithDelta {
	
	private CoConstraintUsage usage;
	private CoConstraintCardinality cardinality;
	private DeltaField<CoConstraintUsage> usageDelta;
	private DeltaField<CoConstraintCardinality> cardinalityDelta;
	
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

	public DeltaField<CoConstraintUsage> getUsageDelta() {
		return usageDelta;
	}

	public void setUsageDelta(DeltaField<CoConstraintUsage> usageDelta) {
		this.usageDelta = usageDelta;
	}

	public DeltaField<CoConstraintCardinality> getCardinalityDelta() {
		return cardinalityDelta;
	}

	public void setCardinalityDelta(DeltaField<CoConstraintCardinality> cardinalityDelta) {
		this.cardinalityDelta = cardinalityDelta;
	}
}
