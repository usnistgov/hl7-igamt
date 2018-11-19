package gov.nist.hit.hl7.igamt.datatype.domain.display;

public class DatatypeSelectItem {

	private String label;
	private DatatypeLabel value;
	public DatatypeSelectItem(String label, DatatypeLabel value) {
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
	public DatatypeLabel getValue() {
		return value;
	}
	public void setValue(DatatypeLabel value) {
		this.value = value;
	}
}
