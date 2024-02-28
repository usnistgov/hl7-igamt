package gov.nist.hit.hl7.igamt.valueset.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class CodeSetVersionInfo {
	
	private String id;
	private Type type;
	private String version;
	private boolean exposted;
	private String comments;
	private String parentId;
	
	
	
	public CodeSetVersionInfo() {
		super();
		this.type = Type.CODESETVERSION;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public boolean isExposted() {
		return exposted;
	}
	public void setExposted(boolean exposted) {
		this.exposted = exposted;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
}
