package gov.nist.hit.hl7.igamt.shared.domain.version;

import gov.nist.hit.hl7.igamt.shared.domain.Type;

public class SaveVersionInfo {

	private String id; 
	private String version;
	private Type type;

	public SaveVersionInfo() {
		super();
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
}
