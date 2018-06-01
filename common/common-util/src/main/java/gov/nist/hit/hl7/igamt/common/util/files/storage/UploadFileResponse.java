package gov.nist.hit.hl7.igamt.common.util.files.storage;

public class UploadFileResponse {
	private String link;

	/**
	 * @param link
	 */
	public UploadFileResponse(String link) {
		super();
		this.link = link;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

}
