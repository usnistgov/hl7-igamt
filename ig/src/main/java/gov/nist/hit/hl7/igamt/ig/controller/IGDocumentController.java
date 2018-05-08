package gov.nist.hit.hl7.igamt.ig.controller;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

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
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.ListElement;
import gov.nist.hit.hl7.igamt.ig.service.IgExportService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;


@RestController
public class IGDocumentController {

  @Autowired
  IgService igService;

  @Autowired
  IgExportService igExportService;

  public IGDocumentController() {
    // TODO Auto-generated constructor stub
  }


  @RequestMapping(value = "/api/igdocuments", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody List<ListElement> getUserIG() {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      String username = authentication.getPrincipal().toString();
      List<Ig> igdouments = igService.findLatestByUsername(username);
      System.out.println(igdouments.size());

      return igService.convertListToDisplayList(igdouments);
    } else {


      throw new AuthenticationCredentialsNotFoundException("No Authentication ");

    }



  }


  @RequestMapping(value = "/api/igdocuments/{id}/display", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody IGDisplay getIgDisplay(@PathVariable("id") String id) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {


      Ig igdoument = igService.findLatestById(id);
      IGDisplay ret = igService.convertDomainToModel(igdoument);
      return ret;

    } else {
      return null;
    }

  }

  @RequestMapping(value = "/api/igdocuments/{id}/export/html", method = RequestMethod.GET)
  public @ResponseBody void exportIgDocumentToHtml(@PathVariable("id") String id,
      HttpServletResponse response) throws ExportException {
    ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(id);
    response.setContentType("text/html");
    response.setHeader("Content-disposition", "attachment;filename=" + exportedFile.getFileName());
    try {
      FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
    } catch (IOException e) {
      throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
    }
  }


}
