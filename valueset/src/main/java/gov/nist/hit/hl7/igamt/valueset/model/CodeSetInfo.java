package gov.nist.hit.hl7.igamt.valueset.model;

import java.util.List;

public class CodeSetInfo {
	private String id;
	private CodeSetMetadata metadata;
	private List<CodeSetVersionInfo> children;
	private boolean disableKeyProtection;
	private boolean exposed;
	private String defaultVersion;
	
	
	public String getDefaultVersion() {
		return defaultVersion;
	}
	public CodeSetInfo() {
		super();
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public CodeSetMetadata getMetadata() {
		return metadata;
	}
	public void setMetadata(CodeSetMetadata metadata) {
		this.metadata = metadata;
	}
	public List<CodeSetVersionInfo> getChildren() {
		return children;
	}
	public void setChildren(List<CodeSetVersionInfo> children) {
		this.children = children;
	}
	public boolean isExposed() {
		return exposed;
	}
	public void setExposed(boolean exposed) {
		this.exposed = exposed;
	}
	public void setDefaultVersion(String latest) {
		this.defaultVersion = latest;
	}

	public boolean isDisableKeyProtection() {
		return disableKeyProtection;
	}

	public void setDisableKeyProtection(boolean disableKeyProtection) {
		this.disableKeyProtection = disableKeyProtection;
	}
}
