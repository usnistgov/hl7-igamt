package gov.nist.hit.hl7.igamt.datatype.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.BasicDBObject;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructure;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.xreference.service.XRefService;


@RestController
public class DatatypeController {

  @Autowired
  private DatatypeService datatypeService;

  @Autowired
  private XRefService xRefService;


  public DatatypeController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/datatypes/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DatatypeStructure getDatatypeStructure(@PathVariable("id") String id,
      Authentication authentication) {
    Datatype datatype = datatypeService.findLatestById(id);
    return datatypeService.convertDomainToStructure(datatype);

  }

  @RequestMapping(value = "/api/datatypes/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DisplayMetadata getDatatypeMetadata(@PathVariable("id") String id,
      Authentication authentication) {
    Datatype Datatype = datatypeService.findLatestById(id);
    return datatypeService.convertDomainToMetadata(Datatype);

  }

  @RequestMapping(value = "/api/datatypes/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody PreDef getDatatypePredef(@PathVariable("id") String id,
      Authentication authentication) {
    Datatype Datatype = datatypeService.findLatestById(id);
    return datatypeService.convertDomainToPredef(Datatype);

  }

  @RequestMapping(value = "/api/datatypes/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody PostDef getDatatypePostdef(@PathVariable("id") String id,
      Authentication authentication) {

    Datatype Datatype = datatypeService.findLatestById(id);
    return datatypeService.convertDomainToPostdef(Datatype);

  }

  @RequestMapping(value = "/api/datatypes/{id}/conformancestatement", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody DatatypeConformanceStatement getDatatypeConformanceStatement(
      @PathVariable("id") String id, Authentication authentication) {

    Datatype datatype = datatypeService.findLatestById(id);
    return datatypeService.convertDomainToConformanceStatement(datatype);
  }

  @RequestMapping(value = "/api/datatypes/{id}/crossref", method = RequestMethod.POST,
      produces = {"application/json"})
  public @ResponseBody Map<String, List<BasicDBObject>> getDatatypeCrossRef(
      @PathVariable("id") String id,
      @RequestParam("filterDatatypeIds") Set<String> filterDatatypeIds,
      @RequestParam("filterSegmentIds") Set<String> filterSegmentIds,
      Authentication authentication) {
    Map<String, List<BasicDBObject>> results =
        xRefService.getDatatypeReferences(id, filterDatatypeIds, filterSegmentIds);
    return results;
  }

}
