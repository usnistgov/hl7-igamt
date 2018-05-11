package gov.nist.hit.hl7.igamt.datatype.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructure;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;


@RestController
public class DatatypeController {

  @Autowired
  DatatypeService datatypeService;

  public DatatypeController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/datatypes/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DatatypeStructure getDatatypeStructure(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      Datatype datatype = datatypeService.findLatestById(id);
      return datatypeService.convertDomainToStructure(datatype);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/datatypes/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DisplayMetadata getDatatypeMetadata(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      Datatype Datatype = datatypeService.findLatestById(id);
      return datatypeService.convertDomainToMetadata(Datatype);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/datatypes/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody PreDef getDatatypePredef(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      Datatype Datatype = datatypeService.findLatestById(id);
      return datatypeService.convertDomainToPredef(Datatype);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/datatypes/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody PostDef getDatatypePostdef(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      Datatype Datatype = datatypeService.findLatestById(id);
      return datatypeService.convertDomainToPostdef(Datatype);
    } else {
      return null;
    }
  }
}
