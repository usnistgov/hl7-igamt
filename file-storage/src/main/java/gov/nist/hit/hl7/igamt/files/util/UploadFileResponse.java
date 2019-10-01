package gov.nist.hit.hl7.igamt.files.util;

public class UploadFileResponse {
	private String link;
	private String name;
	

	/**
	 * @param link
	 */
	public UploadFileResponse(String name) {
		this.setName(name);
	}
	public UploadFileResponse(String name, String link) {
		this.setName(name);
		this.link= link;
	}
	public UploadFileResponse() {
		// TODO Auto-generated constructor stub
	}
	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
