package gov.nist.hit.hl7.igamt.segment.domain.display;

public class SegmentSelectItem {

	private String label;
	private SegmentLabel value;
	public SegmentSelectItem(String label, SegmentLabel value) {
		super();
		this.label = label;
		this.value = value;
	}

	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public SegmentLabel getValue() {
		return value;
	}
	public void setValue(SegmentLabel value) {
		this.value = value;
	}
}
