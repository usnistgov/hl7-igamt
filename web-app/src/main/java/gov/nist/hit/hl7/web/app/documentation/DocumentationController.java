/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.web.app.documentation;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.documentation.domain.Documentation;
import gov.nist.hit.hl7.igamt.documentation.domain.DocumentationType;
import gov.nist.hit.hl7.igamt.documentation.repository.DocumentationRepository;


/**
 * @author Abdelghani El Ouakili
 *
 */
@RestController
public class DocumentationController {

	@Autowired
	DocumentationRepository documentationRepo;


	@RequestMapping(value = "/api/documentations/{id}", method = RequestMethod.GET, produces = {
	"application/json" })
	public Documentation getDocumentation(@PathVariable("id") String id, Authentication authentication) throws Exception
	{
		return documentationRepo.findById(id).orElseThrow(Exception::new);

	}

	@RequestMapping(value = "/api/documentations/save", method = RequestMethod.POST, produces = {
	"application/json" })
	public @ResponseBody Documentation save(Authentication authentication, @RequestBody Documentation documentation) throws Exception
	{
		documentation.setDateUpdated(new Date());
		documentation.setAuthors(authentication.getPrincipal().toString());
		return documentationRepo.save(documentation);

	}
	@RequestMapping(value = "/api/documentations/add", method = RequestMethod.POST, produces = {
	"application/json" })
	public @ResponseBody Documentation save(Authentication authentication, @RequestBody DocumentationAddWrapper documentation) throws Exception
	{
		Documentation doc = new Documentation();
		doc.setAuthors(authentication.getPrincipal().toString());
		doc.setDateUpdated(new Date());
		doc.setType(documentation.getDocumentationType());
		doc.setPosition(documentation.getIndex());
		doc.setLabel("New Section");
		
		return documentationRepo.save(doc);

	}


	@RequestMapping(value = "/api/documentations/updateList", method = RequestMethod.POST, produces = {
	"application/json" })
	public @ResponseBody List<Documentation> save(Authentication authentication, @RequestBody List<Documentation> documentation) throws Exception
	{
		return documentationRepo.saveAll(documentation);

	}


	@RequestMapping(value = "/api/documentations/delete/{id}", method = RequestMethod.POST, produces = {
	"application/json" })
	public List<Documentation> deleteAndUpdatePositions(@PathVariable("id") String id, Authentication authentication,  @RequestBody List<Documentation> documentations) throws Exception
	{
		List<Documentation> ret = new ArrayList<Documentation>();
		int index = 0; 
		for(int i=0; i<documentations.size();i++ ) {
			if(documentations.get(i).getId() != null && documentations.get(i).getId().equals(id)) {
				documentationRepo.deleteById(id);
			}else {
				index = index+1;
				documentations.get(i).setPosition(index);
				documentationRepo.save(documentations.get(i));
			}

		}
		return ret;

	}

	@RequestMapping(value = "/api/documentations/test", method = RequestMethod.GET, produces = {
	"application/json" })

	public @ResponseBody String ssss(
			Authentication authentication)  {
		return "test";
	}
	@RequestMapping(value = "/api/documentations/getAll", method = RequestMethod.GET, produces = {
	"application/json" })
	public List<Documentation> getAll(Authentication authentication) throws Exception {
		List<Documentation> ret = new ArrayList<Documentation>();
		ret.addAll(documentationRepo.findByType(DocumentationType.IMPLEMENTATIONDECISION));
		ret.addAll(documentationRepo.findByType(DocumentationType.GLOSSARY));
		ret.addAll(documentationRepo.findByType(DocumentationType.RELEASENOTE));
		ret.addAll(documentationRepo.findByType(DocumentationType.USERGUIDE));
		ret.addAll(documentationRepo.findByType(DocumentationType.FAQ));
		if(authentication !=null && authentication.isAuthenticated()) {
		ret.addAll(documentationRepo.findByTypeAndAuthors(DocumentationType.USERNOTES, authentication.getPrincipal().toString()));
		}
		return ret;

	}
}
