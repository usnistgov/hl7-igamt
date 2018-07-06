package gov.nist.hit.hl7.igamt.valueset.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;


@RestController
public class ValuesetController extends BaseController {

  @Autowired
  ValuesetService valuesetService;


  public ValuesetController() {}


  @RequestMapping(value = "/api/valuesets/hl7/{version:.+}", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody List<Valueset> findHl7ValueSets(@PathVariable String version,
      Authentication authentication) {
    return valuesetService.findDisplayFormatByScopeAndVersion(Scope.HL7STANDARD.toString(),
        version);
  }

}
