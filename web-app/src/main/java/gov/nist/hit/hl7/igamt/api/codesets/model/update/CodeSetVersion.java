package gov.nist.hit.hl7.igamt.api.codesets.model.update;

import gov.nist.hit.hl7.igamt.api.codesets.model.Code;

import java.util.Date;
import java.util.List;

public class CodeSetVersion {
	private CodeSetMetadata metadata;
	private String version;
	private boolean isLatest;
	private Date commitDate;
	private String codeValueMatch;
	private List<Code> codes;

	public String getCodeValueMatch() {
		return codeValueMatch;
	}

	public void setCodeValueMatch(String codeValueMatch) {
		this.codeValueMatch = codeValueMatch;
	}

	public List<Code> getCodes() {
		return codes;
	}

	public void setCodes(List<Code> codes) {
		this.codes = codes;
	}

	public CodeSetMetadata getMetadata() {
		return metadata;
	}

	public void setMetadata(CodeSetMetadata metadata) {
		this.metadata = metadata;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Date getCommitDate() {
		return commitDate;
	}

	public void setCommitDate(Date commitDate) {
		this.commitDate = commitDate;
	}

	public boolean isLatest() {
		return isLatest;
	}

	public void setLatest(boolean latest) {
		isLatest = latest;
	}
}
