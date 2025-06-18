package gov.nist.hit.hl7.igamt.api.codesets.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;

public class Version {
	@JsonIgnore
	private String id;
	private String version;
	private Date date;

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

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

	@Override
	public boolean equals(Object o) {
		if(this == o) {
			return true;
		}
		if(o == null || getClass() != o.getClass()) {
			return false;
		}

		Version version1 = (Version) o;

		if(! getVersion().equals(version1.getVersion())) {
			return false;
		}
		return getDate().equals(version1.getDate());
	}

	@Override
	public int hashCode() {
		int result = getVersion().hashCode();
		result = 31 * result + getDate().hashCode();
		return result;
	}
}
