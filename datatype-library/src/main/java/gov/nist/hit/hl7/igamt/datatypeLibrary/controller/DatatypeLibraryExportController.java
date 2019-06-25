//package gov.nist.hit.hl7.igamt.datatypeLibrary.controller;
//
//import java.io.IOException;
//
//import javax.servlet.http.HttpServletResponse;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.util.FileCopyUtils;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.ResponseBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
//import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryExportService;
//import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
//import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
//import gov.nist.hit.hl7.igamt.export.exception.ExportException;
//
//@RestController
//public class DatatypeLibraryExportController extends BaseController {
//
//  @Autowired
//  DatatypeLibraryService datatypeLibraryService;
//
////  @Autowired
////  DatatypeLibraryExportService datatypeLibraryExportService;
//
//  public DatatypeLibraryExportController() {
//    super();
//  }
//
//  /**
//   * 
//   * @param id
//   * @param response
//   * @throws ExportException
//   */
////  @RequestMapping(value = "/api/datatype-library/{id}/export/html", method = RequestMethod.GET)
////  public @ResponseBody void exportDatatypeLibraryToHtml(@PathVariable("id") String id,
////      HttpServletResponse response) throws ExportException {
////    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
////    if (authentication != null) {
////      String username = authentication.getPrincipal().toString();
////      ExportedFile exportedFile =
////          datatypeLibraryExportService.exportDatatypeLibraryToHtml(username, id);
////      response.setContentType("text/html");
////      response.setHeader("Content-disposition",
////          "attachment;filename=" + exportedFile.getFileName());
////      try {
////        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
////      } catch (IOException e) {
////        throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
////      }
////    } else {
////      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
////    }
////  }
//
//  /**
//   * 
//   * @param id
//   * @param response
//   * @param authentication
//   * @throws ExportException
//   */
////  @RequestMapping(value = "/api/datatype-library/{id}/export/word", method = RequestMethod.GET)
////  public @ResponseBody void exportIgDocumentToWord(@PathVariable("id") String id,
////      HttpServletResponse response, Authentication authentication) throws ExportException {
////    if (authentication != null) {
////      String username = authentication.getPrincipal().toString();
////      ExportedFile exportedFile =
////          datatypeLibraryExportService.exportDatatypeLibraryToWord(username, id);
////      response.setContentType(
////          "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
////      response.setHeader("Content-disposition",
////          "attachment;filename=" + exportedFile.getFileName());
////      try {
////        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
////      } catch (IOException e) {
////        throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
////      }
////    } else {
////      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
////    }
////  }
//
//  /**
//   * 
//   * @param id
//   * @param response
//   * @throws ExportException
//   */
////  @RequestMapping(value = "/api/datatype-library/{id}/export/web", method = RequestMethod.GET)
////  public @ResponseBody void exportDatatypeLibraryToWeb(@PathVariable("id") String id,
////      HttpServletResponse response) throws ExportException {
////    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
////    if (authentication != null) {
////      String username = authentication.getPrincipal().toString();
////      ExportedFile exportedFile =
////          datatypeLibraryExportService.exportDatatypeLibraryToHtml(username, id);
////      response.setContentType("text/html");
////      response.setHeader("Content-disposition",
////          "attachment;filename=" + exportedFile.getFileName());
////      try {
////        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
////      } catch (IOException e) {
////        throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
////      }
////    } else {
////      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
////    }
////  }
//}
