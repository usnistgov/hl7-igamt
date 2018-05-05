package gov.nist.hit.hl7.igamt.ig.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.ListElement;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.service.impl.CrudService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.messageEvent.Event;
import gov.nist.hit.hl7.igamt.shared.messageEvent.MessageEventService;
import gov.nist.hit.hl7.igamt.shared.messageEvent.MessageEventTreeNode;


@RestController
public class IGDocumentController {

	@Autowired 
	IgService igService;
	
	@Autowired 
	MessageEventService  messageEventService;
	
	@Autowired 
	ConformanceProfileService  conformanceProfileService;
	
	@Autowired 
	CrudService  crudService;
	
	
	public IGDocumentController() {
		// TODO Auto-generated constructor stub
	}
	
	
	@RequestMapping(value = "/api/igdocuments", method = RequestMethod.GET,produces = {"application/json"})

	public @ResponseBody List<ListElement> getUserIG(){
		
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		if (authentication != null) {
			String username = authentication.getPrincipal().toString();
			List<Ig> igdouments =igService.findLatestByUsername(username);
			System.out.println(igdouments.size());
			
			return igService.convertListToDisplayList(igdouments);
		}else {
			
			
			throw new AuthenticationCredentialsNotFoundException("No Authentication ");
				
		}

	}
	
	
	@RequestMapping(value = "/api/igdocuments/{id}/display", method = RequestMethod.GET,produces = {"application/json"})

	public @ResponseBody IGDisplay getIgDisplay(@PathVariable("id") String id){
		
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		if (authentication != null) {
			
			
			Ig igdoument =igService.findLatestById(id);
			IGDisplay ret = igService.convertDomainToModel(igdoument);
			return ret;
			
		}else {
			//redirect 
			return null;
		}
		
	}
	
	
	@RequestMapping(value = "/api/igdocuments/findMessageEvents/{version:.+}", method = RequestMethod.GET,produces = {"application/json"})

	public @ResponseBody List<MessageEventTreeNode> getMessageEvents(@PathVariable("version") String version){
		
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		if (authentication != null) {
		return 	messageEventService.findByHl7Version(version);

		}else {
			return null;
		}
		
	}
	
	
	@RequestMapping(value = "/api/igdocuments/create", method = RequestMethod.POST,produces = {"application/json"})

	public @ResponseBody CompositeKey create(@RequestBody CreationWrapper wrapper, Authentication authentication) throws JsonParseException, JsonMappingException, FileNotFoundException, IOException{
		
			String username = authentication.getPrincipal().toString();
			Ig empty = igService.CreateEmptyIg();
			Set<String> savedIds=new HashSet<String>();
			for(Event ev :  wrapper.getMsgEvts()) {
				ConformanceProfile profile =  conformanceProfileService.findByKey(ev.getId()); 
				if(profile !=null) {
					ConformanceProfile clone = profile.clone();
					clone.setUsername(username);
					clone.setEvent(ev.getName());
					clone.setId(new CompositeKey());
					clone=conformanceProfileService.save(clone);
					clone.setName(profile.getName());
					savedIds.add(clone.getId().getId());
				}
			}
			 empty.setId(new CompositeKey());
             empty.setUsername(username);
             Date date = new Date();
             empty.setCreationDate(date);
             empty.setUpdateDate(date);
             empty.setMetaData(wrapper.getMetaData());
             crudService.addConformanceProfiles(savedIds, empty);
             igService.save(empty);
             return empty.getId();
		
		}
		
	
	
}
