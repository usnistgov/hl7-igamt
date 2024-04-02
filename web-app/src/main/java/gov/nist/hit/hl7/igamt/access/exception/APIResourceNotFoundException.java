package gov.nist.hit.hl7.igamt.access.exception;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class APIResourceNotFoundException extends Exception {
	String id;
	Type type;

	public APIResourceNotFoundException(String id, Type type) {
		super(type + " with id " + id + " not found");
		this.id = id;
		this.type = type;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}
}
