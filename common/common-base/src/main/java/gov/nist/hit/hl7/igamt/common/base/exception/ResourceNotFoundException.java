package gov.nist.hit.hl7.igamt.common.base.exception;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ResourceNotFoundException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2645321696793995422L;
	
	  public ResourceNotFoundException(String id,Type type) {
		    super("Value set with id " + id + " not found");
		  }

}
