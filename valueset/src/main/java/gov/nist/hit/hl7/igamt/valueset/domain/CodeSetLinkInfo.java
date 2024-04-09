package gov.nist.hit.hl7.igamt.valueset.domain;

import java.util.Date;

public class CodeSetLinkInfo {
	
	private String version;
	private String parentName;
	private Date commitDate;
	private boolean latest;
	private Date latestFetched;
	
	
	public CodeSetLinkInfo() {
		super();
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getParentName() {
		return parentName;
	}
	public void setParentName(String parentName) {
		this.parentName = parentName;
	}
	public Date getCommitDate() {
		return commitDate;
	}
	public void setCommitDate(Date commitDate) {
		this.commitDate = commitDate;
	}
	public boolean isLatest() {
		return latest;
	}
	public void setLatest(boolean latest) {
		this.latest = latest;
	}
	public Date getLatestFetched() {
		return latestFetched;
	}
	public void setLatestFetched(Date latestFetched) {
		this.latestFetched = latestFetched;
	}


}
