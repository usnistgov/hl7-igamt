package gov.nist.hit.hl7.igamt.valueset.controller;

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


@RestController
public class ValuesetController {

  @Autowired
  ValuesetService valuesetService;

  public ValuesetController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/valuesets/{id}/structure", method = RequestMethod.GET, produces = {"application/json"})

  public @ResponseBody ValuesetStructure getvaluesetstructure(@PathVariable("id") String id, Authentication authentication) {
    Valueset valueset = valuesetService.findLatestById(id);
    return valuesetService.convertDomainToStructure(valueset);
  }

  @RequestMapping(value = "/api/valuesets/{id}/metadata", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody ValuesetMetadata getDatatypeMetadata(@PathVariable("id") String id, Authentication authentication) {
    Valueset valueset = valuesetService.findLatestById(id);
    return valuesetService.convertDomainToMetadata(valueset);
  }

  @RequestMapping(value = "/api/valuesets/{id}/predef", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody ValuesetPreDef getDatatypePredef(@PathVariable("id") String id, Authentication authentication) {
    Valueset valueset = valuesetService.findLatestById(id);
    return valuesetService.convertDomainToPredef(valueset);
  }

  @RequestMapping(value = "/api/valuesets/{id}/postdef", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody ValuesetPostDef getDatatypePostdef(@PathVariable("id") String id, Authentication authentication) {
    Valueset valueset = valuesetService.findLatestById(id);
    return valuesetService.convertDomainToPostdef(valueset);
  }
}
