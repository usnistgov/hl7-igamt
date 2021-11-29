package gov.nist.hit.hl7.igamt.auth.emails.service;

import gov.nist.hit.hl7.igamt.auth.exception.ErrorEmailException;

public interface ErrorEmailService {

	
	void reportError(String url, String message, String trace,String usrname) throws ErrorEmailException;
	
	
}
