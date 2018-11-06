package gov.nist.hit.hl7.igamt.auth.exception;

public class ErrorEmailException extends Exception {

	  /**
	  * 
	  */
	  private static final long serialVersionUID = 1L;

	  public ErrorEmailException() {
	    super();
	  }

	  public ErrorEmailException(String error) {
	    super(error);
	  }

	  public ErrorEmailException(Exception error) {
	    super(error);
	  }

	
}