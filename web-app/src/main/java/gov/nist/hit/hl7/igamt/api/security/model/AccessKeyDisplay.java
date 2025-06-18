package gov.nist.hit.hl7.igamt.api.security.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

import java.util.Date;
import java.util.Map;
import java.util.Set;

public class AccessKeyDisplay {
	private String id;
	private String name;
	private Date createdAt;
	private Date expireAt;
	private Map<Type, Set<DisplayElement>> resources;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getExpireAt() {
		return expireAt;
	}

	public void setExpireAt(Date expireAt) {
		this.expireAt = expireAt;
	}

	public Map<Type, Set<DisplayElement>> getResources() {
		return resources;
	}

	public void setResources(Map<Type, Set<DisplayElement>> resources) {
		this.resources = resources;
	}

	public boolean isExpired() {
		if(expireAt != null) {
			Date now = new Date();
			return expireAt.before(now) || expireAt.equals(now);
		} else {
			return false;
		}
	}
}
