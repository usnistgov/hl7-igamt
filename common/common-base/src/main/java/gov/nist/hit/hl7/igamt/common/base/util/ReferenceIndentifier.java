package gov.nist.hit.hl7.igamt.common.base.util;

import org.springframework.data.redis.core.index.Indexed;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ReferenceIndentifier {
	@Indexed private String id;
	@Indexed private Type type;
	
	
	public ReferenceIndentifier(String id, Type type) {
		super();
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
