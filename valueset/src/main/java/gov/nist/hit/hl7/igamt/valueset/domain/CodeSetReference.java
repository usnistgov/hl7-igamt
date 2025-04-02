package gov.nist.hit.hl7.igamt.valueset.domain;

public class CodeSetReference {
	
	private String codeSetId;
	private String versionId;
	
	
	public CodeSetReference() {
		super();
	}
	public String getCodeSetId() {
		return codeSetId;
	}
	public void setCodeSetId(String codeSetId) {
		this.codeSetId = codeSetId;
	}
	public String getVersionId() {
		return versionId;
	}
	public void setVersionId(String versionId) {
		this.versionId = versionId;
	}

	

}
