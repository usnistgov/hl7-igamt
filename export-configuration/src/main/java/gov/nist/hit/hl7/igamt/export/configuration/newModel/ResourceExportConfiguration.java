package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class ResourceExportConfiguration extends AbstractDomainExportConfiguration{

	 public ResourceExportConfiguration() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ResourceExportConfiguration(Boolean creationDate, Boolean updateDate, Boolean name, Boolean type,
			Boolean origin, Boolean publicationInfo, Boolean publicationDate, Boolean domainInfo, Boolean comment,
			Boolean description, Boolean createdFrom, Boolean authorNotes, Boolean usageNotes, Boolean from,
			Boolean version, Boolean domainCompatibilityVersion) {
		super(creationDate, updateDate, name, type, origin, publicationInfo, publicationDate, domainInfo, comment, description,
				createdFrom, authorNotes, usageNotes, from, version, domainCompatibilityVersion);
		// TODO Auto-generated constructor stub
	}
	private Boolean preDef = false;
	 private Boolean postDef = false;
	  
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
