package gov.nist.hit.hl7.igamt.api.security.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Document
public class AccessKey {
	@Id
	private String id;
	private String name;
	private Date createdAt;
	@Indexed(unique = true)
	private String token;
	@Indexed()
	private String username;
	private Date expireAt;
	private Map<Type, Set<String>> resources;

	@JsonIgnore
	public boolean isValid() {
		return !isExpired();
	}

	@JsonIgnore
	public boolean isExpired() {
		if(expireAt != null) {
			Date now = new Date();
			return expireAt.before(now) || expireAt.equals(now);
		} else {
			return false;
		}
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Date getExpireAt() {
		return expireAt;
	}

	public void setExpireAt(Date expireAt) {
		this.expireAt = expireAt;
	}

	public Map<Type, Set<String>> getResources() {
		if(resources == null) {
			resources = new HashMap<>();
		}

		return resources;
	}

	public void setResources(Map<Type, Set<String>> resources) {
		this.resources = resources;
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
}
