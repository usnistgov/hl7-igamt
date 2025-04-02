package gov.nist.hit.hl7.igamt.api.security.model;

public class GeneratedAccessKey extends AccessKeyDisplay {
	private String plainToken;

	public GeneratedAccessKey() {
	}

	public GeneratedAccessKey(AccessKeyDisplay display, String plainToken) {
		this.plainToken = plainToken;
		this.setId(display.getId());
		this.setName(display.getName());
		this.setCreatedAt(display.getCreatedAt());
		this.setResources(display.getResources());
		this.setExpireAt(display.getExpireAt());
	}

	public String getPlainToken() {
		return plainToken;
	}

	public void setPlainToken(String plainToken) {
		this.plainToken = plainToken;
	}
}
