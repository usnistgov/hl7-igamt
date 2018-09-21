package gov.nist.hit.hl7.igamt.coconstraints.domain;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonTypeName;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;

@JsonTypeName("Ignore")
public class IgnoreCell extends CoConstraintTableCell {

	private String value;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public IgnoreCell clone(){
		IgnoreCell cell = new IgnoreCell();
		cell.type = this.type;
		cell.value = this.value;
		return cell;
	}
}
