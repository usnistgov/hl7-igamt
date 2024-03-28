package gov.nist.hit.hl7.igamt.api.security.domain;
import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.HashSet;


public class KeyAuthenticationToken extends AbstractAuthenticationToken {

	private final AccessKey key;
	private final OnBehalfOfUser principal;

	public KeyAuthenticationToken(AccessKey key) {
		super(new HashSet<>());
		assert key != null;
		this.key = key;
		this.principal = new OnBehalfOfUser(key.getUsername());
	}

	@Override
	public String getCredentials() {
		return this.key.getToken();
	}

	@Override
	public OnBehalfOfUser getPrincipal() {
		return principal;
	}

	public AccessKey getAccessKey() {
		return key;
	}
}
