package gov.nist.hit.hl7.igamt.workspace.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class DocumentLink {
	String id;
	int positin;
	Type type;
	
	
	public DocumentLink() {
		super();
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getPositin() {
		return positin;
	}
	public void setPositin(int positin) {
		this.positin = positin;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	
	
}
