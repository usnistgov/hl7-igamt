package gov.nist.hit.hl7.igamt.datatype.domain.display;

import java.util.ArrayList;
import java.util.List;

public class DatatypeSelectItemGroup {

	
	private String label;
	private List<DatatypeSelectItem> items=new ArrayList<DatatypeSelectItem>();
	
	
	public List<DatatypeSelectItem> getItems() {
		return items;
	}
	public void setItems(List<DatatypeSelectItem> items) {
		this.items = items;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
}
