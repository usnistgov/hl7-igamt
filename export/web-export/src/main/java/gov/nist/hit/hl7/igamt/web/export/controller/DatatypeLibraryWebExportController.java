package gov.nist.hit.hl7.igamt.web.export.controller;

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

import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.web.export.service.DatatypeLibraryWebExportService;



@RestController
public class DatatypeLibraryWebExportController {

//  @Autowired
//  DatatypeLibraryService datatypeLibraryService;

  @Autowired
  DatatypeLibraryWebExportService datatypeLibraryExportService;

 
  /**
   * 
   * @param id
   * @param response
   * @throws ExportException
   */
  @RequestMapping(value = "/api/web-export/{id}/export/web", method = RequestMethod.GET)
  public @ResponseBody void exportDatatypeLibraryToWeb(@PathVariable("id") String id,
      HttpServletResponse response,  Authentication authentication) throws ExportException {
	  System.out.println("Je suis dans le conroller");
      String username = authentication.getPrincipal().toString();
//      ExportedFile exportedFile =
//          datatypeLibraryExportService.exportDatatypeLibraryToWeb(username, id);
//      response.setContentType("text/html");
//      response.setHeader("Content-disposition",
//          "attachment;filename=" + exportedFile.getFileName());
//      	FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
	  datatypeLibraryExportService.exportDatatypeLibraryToWeb(username, id);
    

  }
}
