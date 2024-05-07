package gov.nist.hit.hl7.igamt.api.codesets.model;

import java.util.List;

public class CodeSetMetadata extends CodeSetInfo {
	private List<Version> versions;

	public CodeSetMetadata() {
	}

	public List<Version> getVersions() {
		return versions;
	}

	public void setVersions(List<Version> versions) {
		this.versions = versions;
	}
}
