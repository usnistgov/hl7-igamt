package gov.nist.hit.hl7.auth.domain;

import java.util.Set;


import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
@Document
public class Account {

	@Id
	private String id;
	private Long accountId; // only for legacy 
	private String username;
	private String password;
	private String email;
	private boolean pending=true;
	private String fullName;
	private String organization;
	private Boolean signedConfidentialityAgreement = false;
	@DBRef
	private Set<Privilege> privileges;
	

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public boolean isPending() {
		return pending;
	}
	public void setPending(boolean pending) {
		this.pending = pending;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getOrganization() {
		return organization;
	}
	public void setOrganization(String organization) {
		this.organization = organization;
	}
	public Boolean getSignedConfidentialityAgreement() {
		return signedConfidentialityAgreement;
	}
	public void setSignedConfidentialityAgreement(Boolean signedConfidentialityAgreement) {
		this.signedConfidentialityAgreement = signedConfidentialityAgreement;
	}
	public Set<Privilege> getPrivileges() {
		return privileges;
	}
	public void setPrivileges(Set<Privilege> privileges) {
		this.privileges = privileges;
	}
	
	@Transient
	public UserDetails userDetails(){
		return new User(getUsername(), getPassword(), !isPending(), true, true, true, privileges);
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Long getAccountId() {
		return accountId;
	}
	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}
	
}