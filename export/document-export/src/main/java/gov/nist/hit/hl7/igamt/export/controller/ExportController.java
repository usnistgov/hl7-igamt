package gov.nist.hit.hl7.igamt.export.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.export.service.impl.IgNewExportServiceImpl;

@RestController
public class ExportController {
	
  @Autowired
  IgNewExportService igExportService;
	
	@RequestMapping(value = "/api/export/igdocuments/{id}/export/html", method = RequestMethod.GET)
	  public @ResponseBody void exportIgDocumentToHtml(@PathVariable("id") String id,
	      HttpServletResponse response) throws ExportException {
		System.out.println("Let's Gooo");
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    System.out.println("We in");
	    if (authentication != null) {
	    	try {
	      String username = authentication.getPrincipal().toString();
	      ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(username, id);
	      response.setContentType("text/html");
	      response.setHeader("Content-disposition",
	          "attachment;filename=" + exportedFile.getFileName());
	      
	        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
	      } catch (Exception e) {
	        throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
	      }
	    } else {
	      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
	    }
	  }

}
