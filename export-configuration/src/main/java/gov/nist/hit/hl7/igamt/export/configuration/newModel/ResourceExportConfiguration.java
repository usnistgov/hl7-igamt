package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class ResourceExportConfiguration extends AbstractDomainExportConfiguration{

	 private Boolean preDef;
	 private Boolean postDef;
	  
	public Boolean getPreDef() {
		return preDef;
	}
	public void setPreDef(Boolean preDef) {
		this.preDef = preDef;
	}
	public Boolean getPostDef() {
		return postDef;
	}
	public void setPostDef(Boolean postDef) {
		this.postDef = postDef;
	}
	  
	  
	  
}
