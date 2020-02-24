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
package gov.nist.hit.hl7.igamt.documentation.controller;
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
		return documentationRepo.save(documentation);

	}

	@RequestMapping(value = "/api/documentations/{id}", method = RequestMethod.DELETE, produces = {
	"application/json" })
	public void delete(@PathVariable("id") String id, Authentication authentication) throws Exception
	{
		documentationRepo.deleteById(id);

	}

	  @RequestMapping(value = "/api/documentations/test", method = RequestMethod.GET, produces = {
	  "application/json" })

	  public @ResponseBody String ssss(
	      Authentication authentication)  {
	      return "test";
	    }
	@RequestMapping(value = "/api/documentations/getAll", method = RequestMethod.GET, produces = {
	"application/json" })
	public List<Documentation> getAll(Authentication authentication) throws Exception
	{
		return documentationRepo.findAll();

	}
}
