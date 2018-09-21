package gov.nist.hit.hl7.igamt.coconstraints.exception;

import java.util.HashMap;
import java.util.Map;

public class CoConstraintSaveException extends Exception {
	
	private Map<String, String> errors;

	public CoConstraintSaveException(Map<String, String> errors) {
		super(errors.toString());
		this.errors = errors;
		
	}

	public Map<String, String> getErrors() {
		return errors;
	}

	public void setErrors(Map<String, String> errors) {
		this.errors = errors;
	}
	
	

}
