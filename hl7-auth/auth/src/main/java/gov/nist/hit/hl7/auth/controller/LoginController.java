package gov.nist.hit.hl7.auth.controller;

import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class LoginController {
	@RequestMapping(value = "/externalLogin", method = RequestMethod.GET)
	public ModelAndView login(HttpServletRequest request,  @RequestParam String host ) {
		
		
		request.getSession().setAttribute("ref", host);

		ModelAndView modelAndView= new ModelAndView("redirect:");

	    
	  return modelAndView;

	}
}
