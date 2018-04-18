package gov.nist.hit.hl7.igamt.ig.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;


@RestController
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
		if (authentication != null) {
			
			String username = authentication.getPrincipal().toString();
			List<Ig> igdouments =igService.findByUsername(username);
			System.out.println(igdouments.size());
			return igdouments;
		}else {
			return null;
		}
		
		
		
		
	}
	
	
	@RequestMapping(value = "/api/igdocuments/{id}/display", method = RequestMethod.GET,produces = {"application/json"})

	public @ResponseBody IGDisplay getIgDisplay(@PathVariable("id") String id){
		
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		if (authentication != null) {
			
			
			String username = authentication.getPrincipal().toString();
			Ig igdoument =igService.findLatestById(id);
			IGDisplay ret = igService.convertDomainToModel(igdoument);
			return ret;
			
		}else {
			return null;
		}
		
	}
	
	

}
