package gov.nist.hit.hl7.igamt.common.base.wrappers;

import java.util.List;

public class ResourcePickerList {

	private  List<VariableKey> selectors;
	private  List<ResourcePicker> children;
	
	public List<VariableKey> getSelectors() {
		return selectors;
	}
	public void setSelectors(List<VariableKey> selectors) {
		this.selectors = selectors;
	}
	public List<ResourcePicker> getChildren() {
		return children;
	}
	public void setChildren(List<ResourcePicker> children) {
		this.children = children;
	}
	
}
