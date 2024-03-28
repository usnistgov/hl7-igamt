package gov.nist.hit.hl7.igamt.valueset.model;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.valueset.domain.Code;

public class CodeSetVersionContent extends CodeSetVersionInfo {
	
	
	private Set<Code> codes;
    private List<String> codeSystems; 
    private boolean latest;
    

  	public CodeSetVersionContent() {
		super();
	}

	public List<String> getCodeSystems() {
		return codeSystems;
	}

	public void setCodeSystems(List<String> codeSystems) {
		this.codeSystems = codeSystems;
	}

	public Set<Code> getCodes() {
		return codes;
	}

	public void setCodes(Set<Code> codes) {
		this.codes = codes;
	}

	public boolean isLatest() {
		return latest;
	}

	public void setLatest(boolean latest) {
		this.latest = latest;
	}


}
