package gov.nist.hit.hl7.igamt.common.base.util;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
@RedisHash
public class RelationShip {

	@Id
	private String id;
	private Usage usage; 
	@Indexed
	private ReferenceIndentifier child;
	
	@Indexed
	private ReferenceIndentifier parent;
	
	private ReferenceLocation location;
	
	
	
	public RelationShip(ReferenceIndentifier child, ReferenceIndentifier parent, ReferenceLocation location) {
		super();
		this.child = child;
		this.parent = parent;
		this.setLocation(location);
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public ReferenceIndentifier getChild() {
		return child;
	}
	public void setChild(ReferenceIndentifier child) {
		this.child = child;
	}
	public ReferenceIndentifier getParent() {
		return parent;
	}
	public void setParent(ReferenceIndentifier parent) {
		this.parent = parent;
	}
	public Usage getUsage() {
		return usage;
	}
	public void setUsage(Usage usage) {
		this.usage = usage;
	}
	public ReferenceLocation getLocation() {
		return location;
	}
	public void setLocation(ReferenceLocation location) {
		this.location = location;
	}
	
	

}
