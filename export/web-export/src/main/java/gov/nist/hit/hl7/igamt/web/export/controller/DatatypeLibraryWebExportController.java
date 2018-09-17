package gov.nist.hit.hl7.igamt.web.export.controller;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PipedInputStream;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
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
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryExportService;
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
  
  DatatypeLibraryExportService datatypeLibraryExportServiceforHtml;
 
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
	  ByteArrayOutputStream baos = datatypeLibraryExportService.exportDatatypeLibraryToWeb(username, id);
	  
      try{
    	  response.setContentType("application/zip");
    	  response.addHeader("Content-Disposition", "attachment; filename="+ "websiteExport"+".zip");
      response.getOutputStream().write(baos.toByteArray());
         }catch(IOException ioe)
         {
             ioe.printStackTrace();
         }

  }
  

}
