package gov.nist.hit.hl7.igamt.conformanceprofile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfileMetadata;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePostDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePreDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;


@RestController
public class ConformanceProfileController {

  @Autowired
  ConformanceProfileService conformanceProfileService;

  public ConformanceProfileController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody ConformanceProfileStructure getConformanceProfileStructure(
      @PathVariable("id") String id, Authentication authentication) {
    ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
    return conformanceProfileService.convertDomainToStructure(conformanceProfile);

  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DisplayConformanceProfileMetadata getConformanceProfileMetadata(
      @PathVariable("id") String id, Authentication authentication) {
    ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
    return conformanceProfileService.convertDomainToMetadata(conformanceProfile);

  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DisplayConformanceProfilePreDef getConformanceProfilePredef(
      @PathVariable("id") String id, Authentication authentication) {
    ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
    return conformanceProfileService.convertDomainToPredef(conformanceProfile);

  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DisplayConformanceProfilePostDef getConformanceProfilePostdef(
      @PathVariable("id") String id, Authentication authentication) {
    ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
    return conformanceProfileService.convertDomainToPostdef(conformanceProfile);

  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/conformancestatement",
      method = RequestMethod.GET, produces = {"application/json"})

  public @ResponseBody ConformanceProfileConformanceStatement getConformanceProfileConformanceStatement(
      @PathVariable("id") String id, Authentication authentication) {

    ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
    return conformanceProfileService.convertDomainToConformanceStatement(conformanceProfile);

  }
}
