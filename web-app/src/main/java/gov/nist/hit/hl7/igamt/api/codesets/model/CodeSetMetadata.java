package gov.nist.hit.hl7.igamt.api.codesets.model;

import java.util.Date;
import java.util.List;

public class CodeSetMetadata extends CodeSetInfo {
	private List<CodeSetVersionInfo> versions;

	public CodeSetMetadata() {
	}

	public CodeSetMetadata(
			String id,
			String name,
			Date dateUpdated,
			String latestStableVersion,
			List<CodeSetVersionInfo> versions
	) {
		super(id, name, dateUpdated, latestStableVersion);
		this.versions = versions;
	}

	public List<CodeSetVersionInfo> getVersions() {
		return versions;
	}

	public void setVersions(List<CodeSetVersionInfo> versions) {
		this.versions = versions;
	}
}
