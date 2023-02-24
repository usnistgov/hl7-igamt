package gov.nist.hit.hl7.igamt.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;

public class Subcon {

	private Level level;
	private String targetId;
	private InstancePath context;

	public Level getLevel() {
		return level;
	}

	public void setLevel(Level level) {
		this.level = level;
	}

	public String getTargetId() {
		return targetId;
	}

	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}

	public InstancePath getContext() {
		return context;
	}

	public void setContext(InstancePath context) {
		this.context = context;
	}
}
