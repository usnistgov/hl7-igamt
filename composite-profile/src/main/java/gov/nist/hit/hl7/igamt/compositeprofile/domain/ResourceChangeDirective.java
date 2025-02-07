package gov.nist.hit.hl7.igamt.compositeprofile.domain;


import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

abstract public class ResourceChangeDirective {
	private final DirectiveContextMatchTarget matchTarget;
	private final String profileComponentId;

	public ResourceChangeDirective(DirectiveContextMatchTarget matchTarget, String profileComponentId) {
		this.matchTarget = matchTarget;
		this.profileComponentId = profileComponentId;
	}

	public String getProfileComponentId() {
		return profileComponentId;
	}

	public boolean matches(Resource resource) {
		return matchTarget.matches(resource);
	}

	public boolean matches(Type type, String resourceId) {
		return matchTarget.matches(type, resourceId);
	}

	public String getContextId() {
		return matchTarget.getResourceId();
	}

	public Type getContextType() {
		return matchTarget.getType();
	}
}
