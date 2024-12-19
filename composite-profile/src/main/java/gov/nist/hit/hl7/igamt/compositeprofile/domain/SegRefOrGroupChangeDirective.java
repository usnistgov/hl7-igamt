package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;

public abstract class SegRefOrGroupChangeDirective {
	private ProfileComponentItem item;

	public ProfileComponentItem getItem() {
		return item;
	}

	public void setItem(ProfileComponentItem item) {
		this.item = item;
	}
}
