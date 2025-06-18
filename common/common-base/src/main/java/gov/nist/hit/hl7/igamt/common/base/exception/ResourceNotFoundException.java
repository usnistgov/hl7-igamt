package gov.nist.hit.hl7.igamt.common.base.exception;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ResourceNotFoundException extends Exception {

	private static final long serialVersionUID = -2645321696793995422L;
	String id;
	Type type;

	public ResourceNotFoundException(String id, Type type) {
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
