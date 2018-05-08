package gov.nist.hit.hl7.igamt.conformanceprofile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;


@RestController
public class ConformanceProfileController {

  @Autowired
  ConformanceProfileService conformanceProfileService;

  public ConformanceProfileController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody ConformanceProfileStructure getConformanceProfileStructure(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
      return conformanceProfileService.convertDomainToStructure(conformanceProfile);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/conformanceprofiles/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DisplayMetadata getConformanceProfileMetadata(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
      return conformanceProfileService.convertDomainToMetadata(conformanceProfile);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/conformanceprofiles/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody PreDef getConformanceProfilePredef(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
      return conformanceProfileService.convertDomainToPredef(conformanceProfile);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/conformanceprofiles/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody PostDef getConformanceProfilePostdef(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
      return conformanceProfileService.convertDomainToPostdef(conformanceProfile);
    } else {
      return null;
    }
  }
}
