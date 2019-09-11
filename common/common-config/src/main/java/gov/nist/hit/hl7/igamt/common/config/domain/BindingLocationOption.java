package gov.nist.hit.hl7.igamt.common.config.domain;

import java.util.List;

public class BindingLocationOption {

	private String label;
	private List<Integer> value;
	
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public List<Integer> getValue() {
		return value;
	}
	public void setValue(List<Integer> locations) {
		this.value = locations;
	}
}
