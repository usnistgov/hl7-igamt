package gov.nist.hit.hl7.igamt.web.app.ig;

public class FormData {

	private String clazz;
	private String json;
	private String config;
	private String documentType;
	
	public String getClazz() {
		return clazz;
	}
	public void setClazz(String clazz) {
		this.clazz = clazz;
	}
	public String getJson() {
		return json;
	}
	public void setJson(String json) {
		this.json = json;
	}
  public String getConfig() {
    return config;
  }
  public void setConfig(String config) {
    this.config = config;
  }
  public String getDocumentType() {
    return documentType;
  }
  public void setDocumentType(String documentType) {
    this.documentType = documentType;
  }
}
