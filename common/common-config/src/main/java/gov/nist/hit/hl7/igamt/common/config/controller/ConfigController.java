package gov.nist.hit.hl7.igamt.common.config.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
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
  private ResponseMessage<Config> getSharedConstant() {
     return new ResponseMessage<Config>(Status.SUCCESS, null, null, null, false, null, this.configService.findOne());
  }


}
