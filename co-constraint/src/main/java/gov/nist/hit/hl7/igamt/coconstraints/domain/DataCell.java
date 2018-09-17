package gov.nist.hit.hl7.igamt.coconstraints.domain;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("Value")
public class DataCell extends CoConstraintTableCell {
	
	private String value;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
	public DataCell clone(){
		DataCell cell = new DataCell();
		cell.type = this.type;
		cell.value = value;
		return cell;
	}
	
}
