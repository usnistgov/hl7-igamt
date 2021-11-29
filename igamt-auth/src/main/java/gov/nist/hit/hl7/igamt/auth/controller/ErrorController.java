package gov.nist.hit.hl7.igamt.auth.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.auth.util.requests.ConnectionResponseMessage;
import gov.nist.hit.hl7.auth.util.requests.PasswordResetTokenResponse;
import gov.nist.hit.hl7.auth.util.requests.ConnectionResponseMessage.Status;
import gov.nist.hit.hl7.igamt.auth.emails.service.AccountManagmenEmailService;
import gov.nist.hit.hl7.igamt.auth.exception.AuthenticationException;
import gov.nist.hit.hl7.igamt.auth.exception.ErrorEmailException;
import gov.nist.hit.hl7.igamt.auth.util.ErrorReport;
import gov.nist.hit.hl7.igamt.auth.emails.service.ErrorEmailService;
@RestController
public class ErrorController {
	  @Autowired
	  AccountManagmenEmailService emailService;
	  @Autowired
	  ErrorEmailService errorEmailService;
	  
	  
	  
	  @RequestMapping(value ="api/errors/report", method = RequestMethod.POST)
	  @ResponseBody
	  public ConnectionResponseMessage<Object> report(@RequestBody
			  ErrorReport error,HttpServletRequest req, HttpServletResponse res, Authentication auth) throws ErrorEmailException{

		    try {
		    		
		    		errorEmailService.reportError(error.getUrl(),error.getMessage(), error.getStack(), auth.getPrincipal().toString());
		    		return    new ConnectionResponseMessage<Object>(Status.SUCCESS, "Error Reported to Admin");

		      } catch (ErrorEmailException e) {
		    	  
		        throw e;
		      }
		  
	  }
	  
	  

}
