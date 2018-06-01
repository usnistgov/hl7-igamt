package gov.nist.hit.hl7.igamt.auth.exception;

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
