package gov.nist.hit.hl7.igamt.compositeprofile.domain;

public class SegRefChangeDirective extends SegRefOrGroupChangeDirective {
	private SegmentChangeDirective segment;

	public SegmentChangeDirective getSegment() {
		return segment;
	}

	public void setSegment(SegmentChangeDirective segment) {
		this.segment = segment;
	}
}
