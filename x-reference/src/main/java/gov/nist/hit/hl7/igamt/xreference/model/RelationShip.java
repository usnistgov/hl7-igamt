package gov.nist.hit.hl7.igamt.xreference.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@RedisHash
public class RelationShip {
	public RelationShip(String child, String parent, String path, ReferenceType referenceType) {
		super();
		this.child = child;
		this.parent = parent;
		this.path = path;
		this.referenceType = referenceType;
	}

	@Id
	private String id;
	@Indexed
	private String child;
	@Indexed
	private String parent;
	private String path;
	private ReferenceType referenceType;


	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getChild() {
		return child;
	}

	public void setChild(String child) {
		this.child = child;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public ReferenceType getReferenceType() {
		return referenceType;
	}

	public void setReferenceType(ReferenceType referenceType) {
		this.referenceType = referenceType;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	

}
