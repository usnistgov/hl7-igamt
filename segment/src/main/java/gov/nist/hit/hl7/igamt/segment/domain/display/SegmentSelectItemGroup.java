package gov.nist.hit.hl7.igamt.segment.domain.display;

import java.util.ArrayList;
import java.util.List;

public class SegmentSelectItemGroup {

	
	private String label;
	private List<SegmentSelectItem> items=new ArrayList<SegmentSelectItem>();
	
	
	public List<SegmentSelectItem> getItems() {
		return items;
	}
	public void setItems(List<SegmentSelectItem> items) {
		this.items = items;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
}
