package gov.nist.hit.hl7.auth.controller;

import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.service.AccountService;
import gov.nist.hit.hl7.auth.service.impl.AccountServiceImpl;
import gov.nist.hit.hl7.auth.util.requests.RegistrationRequest;

@Controller
public class RegistrationController {


	@Autowired 
	private AccountService accountService;
	@RequestMapping(value = "/register", method = RequestMethod.POST,produces = {"application/json"})

	public @ResponseBody Account register( @RequestBody RegistrationRequest user) throws Exception{
		Account a = new Account();
		
		
		if(accountService.emailExist(user.getEmail())) { 
			throw new Exception ("Email Already Used");


		}else if(accountService.userNameExist(user.getUsername())) {

		 throw new Exception ("username Already Used");


		}
		else {
			a.setFullName(user.getFullName());
			a.setEmail(user.getEmail());
			a.setUsername(user.getUsername());
			a.setOrganization(user.getOrganization());
			a.setPassword(user.getPassword());
			a.setSignedConfidentialityAgreement(user.getSignedConfidentialityAgreement());
			
			accountService.createNoramlUser(a);
			return a;




	}


}
}