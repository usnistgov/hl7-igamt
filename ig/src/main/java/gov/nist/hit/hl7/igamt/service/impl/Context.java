package gov.nist.hit.hl7.igamt.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;

public class Context {

	private Level level;
	private String targetId;
	private InstancePath path;

	public Context(Level level, String targetId, InstancePath path) {
		this.level = level;
		this.targetId = targetId;
		this.path = path;
	}

	public Context() {
	}

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

	public InstancePath getPath() {
		return path;
	}

	public void setPath(InstancePath path) {
		this.path = path;
	}
}
