package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.display.model.DisplayElement;

public class AddResourceResponse {
	
	private String id;
	private Registry reg;
	private DisplayElement display;
	
	public Registry getReg() {
		return reg;
	}
	public void setReg(Registry reg) {
		this.reg = reg;
	}
	public DisplayElement getDisplay() {
		return display;
	}
	public void setDisplay(DisplayElement display) {
		this.display = display;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	} 
	
}
