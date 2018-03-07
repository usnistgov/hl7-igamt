package gov.nist.hit.hl7.auth.domain;

import java.util.ArrayList;
import java.util.List;
public class User {

	private String id;
	private String username;
	private List<String> roles;
	
	public User(String id, String username, List<Privilege> privileges) {
		super();
		this.id = id;
		this.username = username;
		this.roles = new ArrayList<>();
		for(Privilege p : privileges){
			this.roles.add(p.getRole());
		}
	}
	
	public User() {
		super();
	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public List<String> getRoles() {
		return roles;
	}
	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
}