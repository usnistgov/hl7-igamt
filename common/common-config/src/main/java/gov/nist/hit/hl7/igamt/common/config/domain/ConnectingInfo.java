package gov.nist.hit.hl7.igamt.common.config.domain;

public class ConnectingInfo {
	
	private String label;
	private String url;
	private String redirectToken;
	private String loginUrl;
	private String createDomainInput;
	private int position;
	
	public ConnectingInfo(String label, String url, String redirectToken, String loginUrl, String createDomainInput, int position) {
		super();
		this.label = label;
		this.url = url;
		this.redirectToken = redirectToken;
		this.loginUrl = loginUrl;
		this.createDomainInput = createDomainInput;
		this.position = position;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getRedirectToken() {
		return redirectToken;
	}
	public void setRedirectToken(String redirectToken) {
		this.redirectToken = redirectToken;
	}
	public String getLoginUrl() {
		return loginUrl;
	}
	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	public String getCreateDomainInput() {
		return createDomainInput;
	}
	public void setCreateDomainInput(String createDomainInput) {
		this.createDomainInput = createDomainInput;
	}

	
}
