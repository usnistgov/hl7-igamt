package gov.nist.hit.hl7.igamt.common.config.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;

@RestController
public class ConfigController {
  @Autowired
  ConfigService configService;

  public ConfigController() {
    // TODO Auto-generated constructor stub
  }


  @RequestMapping(value = "/api/config", method = RequestMethod.GET,
      produces = {"application/json"})
  private Config getSharedConstant() {
    return configService.findOne();
  }


}
