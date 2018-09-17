package gov.nist.hit.hl7.igamt.coconstraints.domain;

public class TextAreaCell extends CoConstraintTableCell {

	private String value;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
	public TextAreaCell clone(){
		TextAreaCell cell = new TextAreaCell();
		cell.type = this.type;
		cell.value = value;
		return cell;
	}
	
}
