package gov.nist.hit.hl7.igamt.ig.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;



public class IGDocumentController {

	@Autowired 
	IgService igService;
	
	public IGDocumentController() {
		// TODO Auto-generated constructor stub
	}
	
	
	@RequestMapping(value = "/api/igdocuments", method = RequestMethod.GET,produces = {"application/json"})

	public @ResponseBody List<Ig> getUserIG(){
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		if (authentication != null
				&& (authentication.getPrincipal() instanceof UserDetails)) {
			UserDetails u=(UserDetails)(authentication.getPrincipal());
			
			return igService.findByUsername(u.getUsername());
		}else {
			return null;
		}
		
		
		
		
	}
	
	

}
