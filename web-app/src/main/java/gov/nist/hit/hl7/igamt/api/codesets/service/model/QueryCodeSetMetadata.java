package gov.nist.hit.hl7.igamt.api.codesets.service.model;

import java.util.Date;
import java.util.List;

public class QueryCodeSetMetadata {
	private String id;
	private String latest;
	private Date dateUpdated;
	private String name;
	private List<String> versions;

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLatest() {
		return latest;
	}

	public void setLatest(String latest) {
		this.latest = latest;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<String> getVersions() {
		return versions;
	}

	public void setVersions(List<String> versions) {
		this.versions = versions;
	}
}
