package gov.nist.hit.hl7.auth.util.requests;




public class RegistrationRequest {
	private String username;
	private String password;
	private String email;

	private String fullname;
	private String organization;
	private Boolean signedConfidentialityAgreement = false;
	
	public RegistrationRequest() {
		super();
		// TODO Auto-generated constructor stub
	}
	
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
	public String getFullName() {
		return fullname;
	}
	public void setFullName(String fullName) {
		this.fullname = fullName;
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
	
	
	
}