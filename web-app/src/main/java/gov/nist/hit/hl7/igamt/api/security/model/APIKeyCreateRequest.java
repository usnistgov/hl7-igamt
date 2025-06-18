package gov.nist.hit.hl7.igamt.api.security.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

import java.util.Map;
import java.util.Set;

public class APIKeyCreateRequest {
	Map<Type, Set<String>> resources;
	boolean expires;
	int validityDays;
	String name;

	public Map<Type, Set<String>> getResources() {
		return resources;
	}

	public void setResources(Map<Type, Set<String>> resources) {
		this.resources = resources;
	}

	public boolean isExpires() {
		return expires;
	}

	public void setExpires(boolean expires) {
		this.expires = expires;
	}

	public int getValidityDays() {
		return validityDays;
	}

	public void setValidityDays(int validityDays) {
		this.validityDays = validityDays;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
