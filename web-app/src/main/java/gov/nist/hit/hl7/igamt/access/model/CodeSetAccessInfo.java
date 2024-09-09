package gov.nist.hit.hl7.igamt.access.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Audience;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

import java.util.Date;

public class CodeSetAccessInfo {
	private Audience audience;
	private String username;
	private Type type;
	private boolean disableKeyProtection;
	private Date dateCommitted;

	public Audience getAudience() {
		return audience;
	}

	public void setAudience(Audience audience) {
		this.audience = audience;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public Date getDateCommitted() {
		return dateCommitted;
	}

	public void setDateCommitted(Date dateCommitted) {
		this.dateCommitted = dateCommitted;
	}

	public boolean isDisableKeyProtection() {
		return disableKeyProtection;
	}

	public void setDisableKeyProtection(boolean disableKeyProtection) {
		this.disableKeyProtection = disableKeyProtection;
	}
}
