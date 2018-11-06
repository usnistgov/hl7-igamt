package gov.nist.hit.hl7.igamt.xreference.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class CrossRef {
	

	private Type type;
	private CrossRefsLabel parent;
	private String location;
	private String namePath;
	private String label;
	
	
	public Type getType() {
		return type;
	}
	public CrossRef() {
		super();
	}
	public void setType(Type type) {
		this.type = type;
	}
	public CrossRefsLabel getParent() {
		return parent;
	}
	public void setParent(CrossRefsLabel parent) {
		this.parent = parent;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getNamePath() {
		return namePath;
	}
	public void setNamePath(String namePath) {
		this.namePath = namePath;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	
	
}
