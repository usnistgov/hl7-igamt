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
	@Indexed(unique = true)
	private String token;
	@Indexed()
	private String username;
	private Date expireAt;
	private boolean active;
	private Map<Type, Set<String>> resources;

	@JsonIgnore
	public boolean isValid() {
		Date now = new Date();
		return this.active && expireAt.after(now);
	}

	@JsonIgnore
	public boolean isExpired() {
		Date now = new Date();
		return expireAt.before(now) || expireAt.equals(now);
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

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
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

}
