package gov.nist.hit.hl7.igamt.ig.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.FileCopyUtils;
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
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.SectionNotFoundException;
import gov.nist.hit.hl7.igamt.ig.model.ChangedObjects;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService;
import gov.nist.hit.hl7.igamt.ig.service.IgExportService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.SaveService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import gov.nist.hit.hl7.igamt.shared.messageEvent.Event;
import gov.nist.hit.hl7.igamt.shared.messageEvent.MessageEventService;
import gov.nist.hit.hl7.igamt.shared.messageEvent.MessageEventTreeNode;

@RestController
public class IGDocumentController {
  @Autowired
  IgService igService;

  @Autowired
  IgExportService igExportService;

  @Autowired
  DisplayConverterService displayConverter;

  @Autowired
  MessageEventService messageEventService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  CrudService crudService;


  @Autowired
  SaveService saveService;

  public IGDocumentController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/igdocuments/{id}/export/html", method = RequestMethod.GET)
  public @ResponseBody void exportIgDocumentToHtml(@PathVariable("id") String id,
      HttpServletResponse response) throws ExportException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      String username = authentication.getPrincipal().toString();
      ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(username, id);
      response.setContentType("text/html");
      response.setHeader("Content-disposition",
          "attachment;filename=" + exportedFile.getFileName());
      try {
        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
      } catch (IOException e) {
        throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
      }
    } else {
      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
    }
  }

  @RequestMapping(value = "/api/igdocuments/{id}/export/word", method = RequestMethod.GET)
  public @ResponseBody void exportIgDocumentToWord(@PathVariable("id") String id,
      HttpServletResponse response) throws ExportException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      String username = authentication.getPrincipal().toString();
      ExportedFile exportedFile = igExportService.exportIgDocumentToWord(username, id);
      response.setContentType(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      response.setHeader("Content-disposition",
          "attachment;filename=" + exportedFile.getFileName());
      try {
        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
      } catch (IOException e) {
        throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
      }
    } else {
      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
    }
  }

  @RequestMapping(value = "/api/igdocuments", method = RequestMethod.GET,
      produces = {"application/json"})


  public @ResponseBody List<IgSummary> getUserIG() {

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

  public @ResponseBody IGDisplay getIgDisplay(@PathVariable("id") String id,
      Authentication authentication) {
    if (authentication != null) {


      Ig igdoument = igService.findLatestById(id);
      IGDisplay ret = displayConverter.convertDomainToModel(igdoument);
      return ret;

    } else {
      // redirect
      throw new AuthenticationCredentialsNotFoundException("No Authentication ");

    }

  }

  @RequestMapping(value = "api/igdocuments/{id}/save", method = RequestMethod.POST)
  public void save(@RequestBody ChangedObjects changedObjects) {
    System.out.println(changedObjects.toString());
  }


  @RequestMapping(value = "/api/igdocuments/findMessageEvents/{version:.+}",
      method = RequestMethod.GET, produces = {"application/json"})

  public @ResponseBody List<MessageEventTreeNode> getMessageEvents(
      @PathVariable("version") String version) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      return messageEventService.findByHl7Version(version);

    } else {
      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
    }

  }


  @RequestMapping(value = "/api/igdocuments/create", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody CompositeKey create(@RequestBody CreationWrapper wrapper,
      Authentication authentication)
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {

    String username = authentication.getPrincipal().toString();
    Ig empty = igService.CreateEmptyIg();
    Set<String> savedIds = new HashSet<String>();
    for (Event ev : wrapper.getMsgEvts()) {
      ConformanceProfile profile = conformanceProfileService.findByKey(ev.getId());
      if (profile != null) {
        ConformanceProfile clone = profile.clone();
        clone.setUsername(username);
        clone.setEvent(ev.getName());
        clone.setId(new CompositeKey());
        clone.setName(profile.getName());
        clone = conformanceProfileService.save(clone);
        savedIds.add(clone.getId().getId());
      }
    }
    empty.setId(new CompositeKey());
    empty.setUsername(username);
    Date date = new Date();
    empty.setCreationDate(date);
    empty.setUpdateDate(date);
    empty.setMetadata(wrapper.getMetadata());
    crudService.AddConformanceProfilesToEmptyIg(savedIds, empty);
    igService.save(empty);
    return empty.getId();
  }


  public IgService getIgService() {
    return igService;
  }


  public void setIgService(IgService igService) {
    this.igService = igService;
  }


  public SaveService getSaveService() {
    return saveService;
  }


  public void setSaveService(SaveService saveService) {
    this.saveService = saveService;
  }



  @RequestMapping(value = "/api/igdocuments/{id}/section/{sectionId}", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody TextSection findSectionById(@PathVariable("id") String id,
      @PathVariable("sectionId") String sectionId)
      throws IGNotFoundException, SectionNotFoundException {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication != null) {
      Ig ig = igService.findIgContentById(id);

      if (ig != null) {
        TextSection s = findSectionById(ig.getContent(), sectionId);
        if (s == null) {
          throw new SectionNotFoundException("Section Not Foud");
        } else {
          return s;
        }
      } else {
        throw new IGNotFoundException("Cannot found Id document");
      }

    } else {

      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
    }



  }

  /**
   * @param content
   * @param sectionId
   * @return
   */
  private TextSection findSectionById(Set<TextSection> content, String sectionId) {
    // TODO Auto-generated method stub
    for (TextSection s : content) {
      TextSection ret = findSectionInside(s, sectionId);
      if (ret != null) {
        return ret;
      }
    }
    return null;

  }

  /**
   * @param s
   * @param sectionId
   * @return
   */
  private TextSection findSectionInside(TextSection s, String sectionId) {
    // TODO Auto-generated method stub
    if (s.getId().equals(sectionId)) {
      return s;
    }
    if (s.getChildren() != null && s.getChildren().size() > 0) {
      for (TextSection ss : s.getChildren()) {
        TextSection ret = findSectionInside(ss, sectionId);
        if (ret != null) {
          return ret;
        }
      }
      return null;
    }
    return null;
  }


}
