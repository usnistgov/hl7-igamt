package gov.nist.hl7.igamt.shared.authentication;

public class LoginRequest {
	private String username;
	private String password;
	public LoginRequest() {
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

}