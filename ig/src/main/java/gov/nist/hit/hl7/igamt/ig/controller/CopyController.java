/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.ig.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CopyWrapper;
import gov.nist.hit.hl7.igamt.ig.model.TreeNode;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.messageEvent.MessageEventService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author ena3
 *
 */
@RestController
public class CopyController {
  @Autowired
  IgService igService;


  @Autowired
  DisplayConverterService displayConverter;

  @Autowired
  MessageEventService messageEventService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  CrudService crudService;

  @Autowired
  ValuesetService valuesetService;


  @RequestMapping(value = "/api/ig/copyConformanceProfile", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody TreeNode copyConformanceProfile(@RequestBody CopyWrapper wrapper,
      Authentication authentication) {
    String username = authentication.getPrincipal().toString();
    ConformanceProfile cp = conformanceProfileService.findDisplayFormat(wrapper.getId());
    return displayConverter.createConformanceProfileNode(cp);

  }


}
