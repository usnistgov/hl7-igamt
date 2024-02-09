package gov.nist.hit.hl7.igamt.valueset.domain;

public class CodeSetReference {
	
	private String host;
	private String url;
	private String version;
	private String slug;
	
	
	public CodeSetReference() {
		super();
	}
	
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getSlug() {
		return slug;
	}
	public void setSlug(String slug) {
		this.slug = slug;
	}
	

}
