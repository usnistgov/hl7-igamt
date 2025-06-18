package gov.nist.hit.hl7.igamt.api.codesets.model;

import java.util.Date;

public class CodeSetVersionMetadata {
	String id;
	String name;
	Date date;
	int numberOfCodes;
	String version;

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
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

	public int getNumberOfCodes() {
		return numberOfCodes;
	}

	public void setNumberOfCodes(int numberOfCodes) {
		this.numberOfCodes = numberOfCodes;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}
}
