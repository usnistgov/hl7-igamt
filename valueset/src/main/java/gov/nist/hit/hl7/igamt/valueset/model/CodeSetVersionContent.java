package gov.nist.hit.hl7.igamt.valueset.model;

import java.util.Set;

import gov.nist.hit.hl7.igamt.valueset.domain.Code;

public class CodeSetVersionContent extends CodeSetVersionInfo{
	
	
	private Set<Code> codes;

  	public CodeSetVersionContent() {
		super();
	}

	public Set<Code> getCodes() {
		return codes;
	}

	public void setCodes(Set<Code> codes) {
		this.codes = codes;
	}


}
