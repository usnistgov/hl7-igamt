package gov.nist.hit.hl7.igamt.access.model;

import org.springframework.security.core.GrantedAuthority;

import java.util.Set;

public class AccessToken {
	String username;
	Set<GrantedAuthority> authorities;

	public AccessToken(String username, Set<GrantedAuthority> authorities) {
		this.username = username;
		this.authorities = authorities;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Set<GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(Set<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}
}
