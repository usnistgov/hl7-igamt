package gov.nist.hit.hl7.igamt.valueset.model;

public class CodeSetVersionCommit {
	private String comments;
	private String version;
	private boolean markAsLatestStable;

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public boolean isMarkAsLatestStable() {
		return markAsLatestStable;
	}

	public void setMarkAsLatestStable(boolean markAsLatestStable) {
		this.markAsLatestStable = markAsLatestStable;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}
}
