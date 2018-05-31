package gov.nist.hit.hl7.igamt.auth.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.auth.util.requests.LoginRequest;
import gov.nist.hit.hl7.auth.util.requests.RegistrationRequest;

@RestController
public class AuthenticationController {
	
	    @Autowired AuthenticationService authService;
	

		@RequestMapping(value = "/login", method = RequestMethod.POST)
		public ResponseEntity login(@RequestBody LoginRequest user)  throws AuthenticationException{
			
			
			try {
				String token = authService.connect(user);
				
				HttpHeaders headers = new HttpHeaders();
				headers.add(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");
				headers.add("Authorization", token);
				ResponseEntity<String> response = ResponseEntity.ok().headers(headers).body("");
				
						
				
				
				return response;

			} catch (AuthenticationException e) {	
				 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());	
			}
			catch (Exception e) {
				 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
				
			}
		}
		
		
		
		
		@RequestMapping(value = "/register", method = RequestMethod.POST)
		public ResponseEntity register(@RequestBody RegistrationRequest user)  throws AuthenticationException{			
			try {
				authService.register(user);
				HttpHeaders headers = new HttpHeaders();
				headers.add(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");
				ResponseEntity<String> response = ResponseEntity.ok().headers(headers).body(user.getUsername());
				return response;

			} catch (AuthenticationException e) {	
				 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());	
			}
			catch (Exception e) {
				 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
				
			}
		}


}
