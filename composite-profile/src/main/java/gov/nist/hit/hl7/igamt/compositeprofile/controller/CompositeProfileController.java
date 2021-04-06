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
package gov.nist.hit.hl7.igamt.compositeprofile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@RestController
public class CompositeProfileController {
  @Autowired 
  CommonService commonService;

  @Autowired
  CompositeProfileStructureService compositeProfileService;


  @RequestMapping(value = "/api/composite-profile/{id}", method = RequestMethod.GET,
      produces = {"application/json"})

  public CompositeProfileStructure getCompositeProfile(@PathVariable("id") String id, Authentication authentication) {
    return compositeProfileService.findById(id);
  }

  @RequestMapping(value = "/api/composite-profile", method = RequestMethod.POST,
      produces = {"application/json"})
  public CompositeProfileStructure save(Authentication authentication, @RequestBody CompositeProfileStructure compositeProfileStructure) {
    return compositeProfileService.save(compositeProfileStructure);
  }
  
}