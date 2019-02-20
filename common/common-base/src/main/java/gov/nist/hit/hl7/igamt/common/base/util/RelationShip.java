package gov.nist.hit.hl7.igamt.common.base.util;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
@RedisHash
public class RelationShip {


	@Id
	private String id;
	@Indexed
	private ReferenceIndentifier child;
	@Indexed
	private ReferenceIndentifier parent;
	private String path;
	public RelationShip(ReferenceIndentifier child, ReferenceIndentifier parent, String path) {
		super();
		this.child = child;
		this.parent = parent;
		this.path = path;
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
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	

	
	

}
