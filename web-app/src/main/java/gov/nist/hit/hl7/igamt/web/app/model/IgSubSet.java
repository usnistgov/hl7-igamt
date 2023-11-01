package gov.nist.hit.hl7.igamt.web.app.model;

import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

import java.util.HashSet;
import java.util.Set;

public class IgSubSet {
	Set<String> inMemoryDataTokens = new HashSet<>();
	String originalIg;
	Ig subSet;
	ReqId profiles;

	public Set<String> getInMemoryDataTokens() {
		return inMemoryDataTokens;
	}

	public void setInMemoryDataTokens(Set<String> inMemoryDataTokens) {
		this.inMemoryDataTokens = inMemoryDataTokens;
	}

	public String getOriginalIg() {
		return originalIg;
	}

	public void setOriginalIg(String originalIg) {
		this.originalIg = originalIg;
	}

	public Ig getSubSet() {
		return subSet;
	}

	public void setSubSet(Ig subSet) {
		this.subSet = subSet;
	}

	public ReqId getProfiles() {
		return profiles;
	}

	public void setProfiles(ReqId profiles) {
		this.profiles = profiles;
	}
}
