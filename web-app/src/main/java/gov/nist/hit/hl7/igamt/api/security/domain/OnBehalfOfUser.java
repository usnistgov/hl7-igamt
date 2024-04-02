package gov.nist.hit.hl7.igamt.api.security.domain;

import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;

public class OnBehalfOfUser implements AuthenticatedPrincipal {
	private String username;
	private Collection<GrantedAuthority> authorities;

	public OnBehalfOfUser(String username) {
		this.username = username;
		this.authorities = new HashSet<>();
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Collection<GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(Collection<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	@Override
	public String getName() {
		return username;
	}
}
