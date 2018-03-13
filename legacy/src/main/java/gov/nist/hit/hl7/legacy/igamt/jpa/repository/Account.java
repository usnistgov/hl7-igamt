package gov.nist.hit.hl7.legacy.igamt.jpa.repository;
import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.jpa.domain.AbstractPersistable;

/**
 * @author fdevaulx
 * 
 */
@Entity
@JsonIgnoreProperties(value = "new", ignoreUnknown = true)
public class Account  implements Serializable {

	private static final long serialVersionUID = 20130625L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	protected Long id;
	
	@Transient
	private String registrationPassword;

	@JsonIgnore
	private boolean entityDisabled = false;

	@JsonIgnore
	// TODO remove it and check it doesn't affect REST API security
	private boolean pending = false;

	@Length(max = 100)
	private String accountType;

	@Length(max = 100)
	@Column(unique = true)
	private String username;

	@Email
	@Length(max = 100)
	@Column(unique = true)
	private String email;

	@Length(max = 100)
	@Column(unique = true)
	private String fullName;

	@Length(max = 100)
	private String phone;

	@Length(max = 100)
	private String employer;
	
 	@Length(max = 100)
	private String title;
	
 	@Length(max = 100)
	private String juridiction;
	

	private Boolean signedConfidentialityAgreement = false;

	public Account() {
		this(null);
	}

	/**
	 * Creates a new account instance.
	 */
	public Account(Long id) {
		this.setId(id);
	}

	/**
	 * @return the username
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * @param username
	 *            the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email
	 *            the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the phone
	 */
	public String getPhone() {
		return phone;
	}

	/**
	 * @param phone
	 *            the phone to set
	 */
	public void setPhone(String phone) {
		this.phone = phone;
	}

	/**
	 * @return the entityDisabled
	 */
	public boolean isEntityDisabled() {
		return entityDisabled;
	}

	/**
	 * @param entityDisabled
	 *            the entityDisabled to set
	 */
	public void setEntityDisabled(boolean entityDisabled) {
		this.entityDisabled = entityDisabled;
	}

	// Only used for registration
	/**
	 * @return the password
	 */
	public String getPassword() {
		return registrationPassword;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String registrationPassword) {
		this.registrationPassword = registrationPassword;
	}

	/**
	 * @return the accountType
	 */
	public String getAccountType() {
		return accountType;
	}

	/**
	 * @param accountType
	 *            the accountType to set
	 */
	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	 

	/**
	 * @return the signedConfidentialityAgreement
	 */
	public Boolean getSignedConfidentialityAgreement() {
		return signedConfidentialityAgreement;
	}

	/**
	 * @param signedConfidentialityAgreement
	 *            the signedConfidentialityAgreement to set
	 */
	public void setSignedConfidentialityAgreement(
			Boolean signedConfidentialityAgreement) {
		this.signedConfidentialityAgreement = signedConfidentialityAgreement;
	}

	/**
	 * @return the pending
	 */
	public boolean isPending() {
		return pending;
	}

	/**
	 * @param pending
	 *            the pending to set
	 */
	public void setPending(boolean pending) {
		this.pending = pending;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmployer() {
		return employer;
	}

	public void setEmployer(String employer) {
		this.employer = employer;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getJuridiction() {
		return juridiction;
	}

	public void setJuridiction(String juridiction) {
		this.juridiction = juridiction;
	}
}