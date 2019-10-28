package gov.nist.hit.hl7.igamt.verification.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.verification.domain.VerificationReport;
import gov.nist.hit.hl7.igamt.verification.service.VerificationService;
import gov.nist.hit.hl7.igamt.verification.service.impl.VerificationResult;

@RestController
public class VerificationController extends BaseController {

  Logger log = LoggerFactory.getLogger(VerificationController.class);

  @Autowired
  private VerificationService verificationService;

  public VerificationController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/verification/xml", method = RequestMethod.POST, produces = {"application/json"})
  @ResponseBody
  public VerificationReport verifyXML(@RequestBody String profileXML,
      @RequestBody String constraintXML, @RequestBody String valuesetXML,
      Authentication authentication) {
    return this.verificationService.verifyXMLs(profileXML, constraintXML, valuesetXML);
  }

  @RequestMapping(value = "/api/verification/valueset", method = RequestMethod.POST, produces = {"application/json"})
  @ResponseBody
  public VerificationResult verifyValueset(@RequestParam(name = "dId", required = true) String documentId, @RequestBody Valueset valueset, Authentication authentication) {
    return this.verificationService.verifyValueset(valueset, documentId);
  }
  
  @RequestMapping(value = "/api/verification/datatype", method = RequestMethod.POST, produces = {"application/json"})
  @ResponseBody
  public VerificationResult verifyDatatype(@RequestParam(name = "dId", required = true) String documentId, @RequestBody Datatype datatype, Authentication authentication) {
    return this.verificationService.verifyDatatype(datatype, documentId);
  }
  
  @RequestMapping(value = "/api/verification/segment", method = RequestMethod.POST, produces = {"application/json"})
  @ResponseBody
  public VerificationResult verifySegment(@RequestParam(name = "dId", required = true) String documentId, @RequestBody Segment segment, Authentication authentication) {
    return this.verificationService.verifySegment(segment, documentId);
  }
  
  @RequestMapping(value = "/api/verification/conformance-profile", method = RequestMethod.POST, produces = {"application/json"})
  @ResponseBody
  public VerificationResult verifyConformanceProfile(@RequestParam(name = "dId", required = true) String documentId, @RequestBody ConformanceProfile conformanceProfile, Authentication authentication) {
    return this.verificationService.verifyConformanceProfile(conformanceProfile, documentId);
  }

}
