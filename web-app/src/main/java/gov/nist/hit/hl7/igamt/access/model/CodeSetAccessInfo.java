package gov.nist.hit.hl7.igamt.access.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Audience;

public class CodeSetAccessInfo {
	private Audience audience;

	public Audience getAudience() {
		return audience;
	}

	public void setAudience(Audience audience) {
		this.audience = audience;
	}
}
