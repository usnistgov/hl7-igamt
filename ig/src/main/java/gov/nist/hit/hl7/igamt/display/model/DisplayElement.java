package gov.nist.hit.hl7.igamt.display.model;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class DisplayElement {
	
	private String id; 
	private String fixedName;
	private String variableName;
	private String description;
	private DomainInfo domainInfo;
	private Type type;
	private boolean leaf; // eventually for lazy loading
	private int position;
	private boolean differantial;
	
	
	
	public String getFixedName() {
		return fixedName;
	}
	public void setFixedName(String fixedName) {
		this.fixedName = fixedName;
	}
	public String getVariableName() {
		return variableName;
	}
	public void setVariableName(String variableName) {
		this.variableName = variableName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public DomainInfo getDomainInfo() {
		return domainInfo;
	}
	public void setDomainInfo(DomainInfo domainInfo) {
		this.domainInfo = domainInfo;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	public boolean isLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	public boolean isDifferantial() {
		return differantial;
	}
	public void setDifferantial(boolean differantial) {
		this.differantial = differantial;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	

}
