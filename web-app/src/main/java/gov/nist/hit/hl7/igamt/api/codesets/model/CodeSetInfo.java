package gov.nist.hit.hl7.igamt.api.codesets.model;

import java.util.Date;

public class CodeSetInfo {
	private String id;
	private String name;
	private Date dateUpdated;
	private String latestStableVersion;

	public CodeSetInfo() {
	}

	public CodeSetInfo(String id, String name, Date dateUpdated, String latestStableVersion) {
		this.id = id;
		this.name = name;
		this.dateUpdated = dateUpdated;
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

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public String getLatestStableVersion() {
		return latestStableVersion;
	}

	public void setLatestStableVersion(String latestStableVersion) {
		this.latestStableVersion = latestStableVersion;
	}
}
