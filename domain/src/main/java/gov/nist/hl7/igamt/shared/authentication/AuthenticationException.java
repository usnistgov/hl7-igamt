package gov.nist.hl7.igamt.shared.authentication;

public class AuthenticationException extends Exception{
	
	  public  AuthenticationException() {
		    super();
		  }

		  public  AuthenticationException(String error) {
		    super(error);
		  }

		  public  AuthenticationException(Exception error) {
		    super(error);
		  }

}
