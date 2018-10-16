package gov.nist.hit.hl7.igamt.auth.emails.service.impl;

import static org.assertj.core.api.Assertions.catchThrowableOfType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.auth.util.requests.ConnectionResponseMessage;
import gov.nist.hit.hl7.auth.util.requests.UserResponse;
import gov.nist.hit.hl7.igamt.auth.emails.service.ErrorEmailService;
import gov.nist.hit.hl7.igamt.auth.exception.ErrorEmailException;
@Service
public class ErrorEmailServiceImpl implements ErrorEmailService {

	  @Autowired
	  private SimpleMailMessage templateMessage;

	  @Autowired
	  Environment env;

	  private static final String ADMIN_EMAIL = "admin.to";
	  private static final String ADMIN_EMAIL_CC = "admin.cc";

	  @Autowired
	  private JavaMailSender mailSender;
	  
	  
	@Override
	public void reportError(String url, String message, String trace,
			String username) throws ErrorEmailException {
		// TODO Auto-generated method stub
	    SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
	    msg.setTo(env.getProperty(ADMIN_EMAIL));
	    msg.setSubject("Automatic reported Error");
	    msg.setFrom("igamt-error@nist.gov");
	    msg.setCc(parseCC(env.getProperty(ADMIN_EMAIL_CC)));
	    msg.setText("Dear IGAMT ADMIN \n\n"
	        + "**** The User With Username "+username+" got this error : \n\n"+message +"\n\n"+
	        "url:\n"+
	        url+"\n\n"
	        +"stack trace:\n"+
	        trace+"\n\n"
	    		);
	    try {
	      this.mailSender.send(msg);
	    } catch (MailException e) {
	    	throw new  	ErrorEmailException(e.getMessage());
	    } catch (RuntimeException e) {
	    	throw new  ErrorEmailException(e.getMessage());

	    } catch (Exception e) {
	    	throw new  	ErrorEmailException(e.getMessage());

	    }
		
		

	
	}
	
	
	public String[] parseCC(String s){
		
		return s.split(";");
	
	}

}
