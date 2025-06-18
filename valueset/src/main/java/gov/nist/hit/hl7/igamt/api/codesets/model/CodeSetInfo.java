package gov.nist.hit.hl7.igamt.api.codesets.model;

public class CodeSetInfo {
	private String id;
	private String name;
	private Version latestStableVersion;

	public CodeSetInfo() {
	}

	public CodeSetInfo(String id, String name, Version latestStableVersion) {
		this.id = id;
		this.name = name;
		this.latestStableVersion = latestStableVersion;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Version getLatestStableVersion() {
		return latestStableVersion;
	}

	public void setLatestStableVersion(Version latestStableVersion) {
		this.latestStableVersion = latestStableVersion;
	}
}
