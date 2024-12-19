package gov.nist.hit.hl7.igamt.compositeprofile.domain;

public class SegmentContextChangeDirective extends ResourceChangeDirective {
	private SegmentChangeDirective directive;

	public SegmentContextChangeDirective(DirectiveContextMatchTarget matchTarget, String profileComponentId) {
		super(matchTarget, profileComponentId);
	}

	public SegmentChangeDirective getDirective() {
		return directive;
	}

	public void setDirective(SegmentChangeDirective segmentChangeDirective) {
		this.directive = segmentChangeDirective;
	}
}
