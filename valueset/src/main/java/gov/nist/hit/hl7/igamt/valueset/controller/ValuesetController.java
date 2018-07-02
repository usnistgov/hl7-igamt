package gov.nist.hit.hl7.igamt.valueset.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetMetadata;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetPostDef;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetPreDef;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetStructure;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.BasicDBObject;

import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.xreference.service.XRefService;


@RestController
public class ValuesetController {
  
  @Autowired
  ValuesetService valuesetService;
  
  @Autowired
  private XRefService xRefService;

  public ValuesetController() {}


  @RequestMapping(value = "/api/valuesets/{id}/structure", method = RequestMethod.GET, produces = {"application/json"})

  public @ResponseBody ValuesetStructure getValuesetStructure(@PathVariable("id") String id, Authentication authentication) {
    Valueset valueset = valuesetService.findLatestById(id);
    return valuesetService.convertDomainToStructure(valueset);
  }

  @RequestMapping(value = "/api/valuesets/{id}/metadata", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody ValuesetMetadata getValuesetMetadata(@PathVariable("id") String id, Authentication authentication) {
    Valueset valueset = valuesetService.findLatestById(id);
    return valuesetService.convertDomainToMetadata(valueset);
  }

  @RequestMapping(value = "/api/valuesets/{id}/predef", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody ValuesetPreDef getValuesetPredef(@PathVariable("id") String id, Authentication authentication) {
    Valueset valueset = valuesetService.findLatestById(id);
    return valuesetService.convertDomainToPredef(valueset);
  }

  @RequestMapping(value = "/api/valuesets/{id}/postdef", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody ValuesetPostDef getValuesetPostdef(@PathVariable("id") String id, Authentication authentication) {
    Valueset valueset = valuesetService.findLatestById(id);
    return valuesetService.convertDomainToPostdef(valueset);
  }
  
  @RequestMapping(value = "/api/valuesets/{id}/crossref", method = RequestMethod.POST,
      produces = {"application/json"})
  public @ResponseBody Map<String, List<BasicDBObject>> getDatatypeCrossRef(
      @PathVariable("id") String id,
      @RequestParam("filterDatatypeIds") Set<String> filterDatatypeIds,
      @RequestParam("filterSegmentIds") Set<String> filterSegmentIds,
      Authentication authentication) {
    Map<String, List<BasicDBObject>> results =
        xRefService.getValueSetReferences(id, filterDatatypeIds, filterSegmentIds);
    return results;
  }
}
