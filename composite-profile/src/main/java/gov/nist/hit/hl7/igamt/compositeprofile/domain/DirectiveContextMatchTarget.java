package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class DirectiveContextMatchTarget {
	private final String resourceId;
	private final Type type;

	public DirectiveContextMatchTarget(String resourceId, Type type) {
		this.resourceId = resourceId;
		this.type = type;
	}

	public boolean matches(Resource resource) {
		return resource.getType().equals(this.type) && resource.getId().equals(this.resourceId);
	}

	public boolean matches(Type type, String resourceId) {
		return this.type.equals(type) && this.resourceId.equals(resourceId);
	}

	public String getResourceId() {
		return resourceId;
	}

	public Type getType() {
		return type;
	}
}
