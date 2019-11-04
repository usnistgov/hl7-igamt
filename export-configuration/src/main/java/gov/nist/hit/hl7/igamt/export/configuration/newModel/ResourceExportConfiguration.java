package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;


public class ResourceExportConfiguration extends AbstractDomainExportConfiguration{

	 public ResourceExportConfiguration() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ResourceExportConfiguration(Boolean creationDate, Boolean updateDate, Boolean name, Boolean type,
									   Boolean origin, Boolean publicationInfo, Boolean publicationDate, Boolean domainInfo, Boolean comment,
									   Boolean description, Boolean createdFrom, Boolean authorNotes, Boolean usageNotes, Boolean from,
									   Boolean version, Boolean domainCompatibilityVersion, Boolean deltaMode, DeltaConfiguration deltaConfig) {
		super(creationDate, updateDate, name, type, origin, publicationInfo, publicationDate, domainInfo, comment, description,
				createdFrom, authorNotes, usageNotes, from, version, domainCompatibilityVersion,deltaMode, deltaConfig);
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
