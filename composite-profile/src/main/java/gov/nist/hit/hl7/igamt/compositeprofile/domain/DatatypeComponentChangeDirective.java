package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;

import java.util.ArrayList;
import java.util.List;

public class DatatypeComponentChangeDirective {
	private ProfileComponentItem item;
	private DatatypeChangeDirective datatype;

	public DatatypeChangeDirective getDatatype() {
		return datatype;
	}

	public void setDatatype(DatatypeChangeDirective datatype) {
		this.datatype = datatype;
	}

	public ProfileComponentItem getItem() {
		return item;
	}

	public void setItem(ProfileComponentItem item) {
		this.item = item;
	}
}
