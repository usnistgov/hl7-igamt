package gov.nist.hit.hl7.igamt.api.codesets.service.model;

import java.util.Date;

public class QueryCodeSetVersionMetadata {
	String id;
	String version;
	Date dateCommitted;

	public Date getDateCommitted() {
		return dateCommitted;
	}

	public void setDateCommitted(Date dateCommitted) {
		this.dateCommitted = dateCommitted;
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
}
