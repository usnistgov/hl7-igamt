package gov.nist.hit.hl7.igamt.valueset.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;


@RestController
public class ValuesetController {

  @Autowired
  ValuesetService valuesetService;


  public ValuesetController() {}



}
