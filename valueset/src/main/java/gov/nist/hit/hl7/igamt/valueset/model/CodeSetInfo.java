package gov.nist.hit.hl7.igamt.valueset.model;

import java.util.List;

public class CodeSetInfo {

	private String id;
	private CodeSetMetadata metadata;
	private List<CodeSetVersionInfo> children;
	private boolean disableKeyProtection;
	private String defaultVersion;
	private boolean viewOnly;
	private boolean published;

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

	public void setDefaultVersion(String latest) {
		this.defaultVersion = latest;
	}

	public boolean isDisableKeyProtection() {
		return disableKeyProtection;
	}

	public void setDisableKeyProtection(boolean disableKeyProtection) {
		this.disableKeyProtection = disableKeyProtection;
	}

	public boolean isViewOnly() {
		return viewOnly;
	}

	public void setViewOnly(boolean viewOnly) {
		this.viewOnly = viewOnly;
	}

	public boolean isPublished() {
		return published;
	}

	public void setPublished(boolean published) {
		this.published = published;
	}
}
