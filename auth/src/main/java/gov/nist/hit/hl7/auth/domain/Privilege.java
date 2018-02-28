package gov.nist.hit.hl7.auth.domain;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document
public class Privilege implements GrantedAuthority {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4620177956250204657L;
	@JsonIgnore
	@org.springframework.data.annotation.Id
	private String Id;
	private String role;
	
	public Privilege(){
		
	}
	
	public Privilege(String role) {
		super();
		this.role = role;
	}

	public String getId() {
		return Id;
	}
	public void setId(String id) {
		Id = id;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}

	@Override
	public String toString() {
		return "Privilege [Id=" + Id + ", role=" + role + "]";
	}

	@Override
	public String getAuthority() {
		return role;
	}
}