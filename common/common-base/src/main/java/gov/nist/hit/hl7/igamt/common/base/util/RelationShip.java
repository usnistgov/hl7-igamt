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
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((child == null) ? 0 : child.hashCode());
		result = prime * result + ((parent == null) ? 0 : parent.hashCode());
		result = prime * result + ((path == null) ? 0 : path.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RelationShip other = (RelationShip) obj;
		if (child == null) {
			if (other.child != null)
				return false;
		} else if (!child.equals(other.child))
			return false;
		if (parent == null) {
			if (other.parent != null)
				return false;
		} else if (!parent.equals(other.parent))
			return false;
		if (path == null) {
			if (other.path != null)
				return false;
		} else if (!path.equals(other.path))
			return false;
		return true;
	}

	
	

}
