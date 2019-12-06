package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class Columns {
	
	private PositionAndPresence segment;
	private PositionAndPresence flavor;
	private PositionAndPresence elementName;
	private PositionAndPresence usage;
	private PositionAndPresence cardinality;
	
	public PositionAndPresence getSegment() {
		return segment;
	}
	public void setSegment(PositionAndPresence segment) {
		this.segment = segment;
	}
	public PositionAndPresence getFlavor() {
		return flavor;
	}
	public void setFlavor(PositionAndPresence flavor) {
		this.flavor = flavor;
	}
	public PositionAndPresence getElementName() {
		return elementName;
	}
	public void setElementName(PositionAndPresence elementName) {
		this.elementName = elementName;
	}
	public PositionAndPresence getUsage() {
		return usage;
	}
	public void setUsage(PositionAndPresence usage) {
		this.usage = usage;
	}
	public PositionAndPresence getCardinality() {
		return cardinality;
	}
	public void setCardinality(PositionAndPresence cardinality) {
		this.cardinality = cardinality;
	}
	
	
	
}