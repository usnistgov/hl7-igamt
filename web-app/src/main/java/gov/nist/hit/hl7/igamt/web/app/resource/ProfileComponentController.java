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
package gov.nist.hit.hl7.igamt.web.app.resource;

import java.util.Date;
import java.util.List;
import java.util.Set;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCoConstraintBindings;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConformanceStatement;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDynamicMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityType;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentContextNotFoundException;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentNotFoundException;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.web.app.service.DateUpdateService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@RestController
public class ProfileComponentController extends BaseController {

  Logger log = LoggerFactory.getLogger(ProfileComponentController.class);
  @Autowired
  SegmentService segmentService;
  
  @Autowired
  ConformanceProfileService conformanceProfileService;
  
  @Autowired
  ProfileComponentService profileComponentService;
  
  @Autowired
  EntityChangeService entityChangeService;

  @Autowired 
  CommonService commonService;
  
  @Autowired
  DateUpdateService dateUpdateService;
    
  @RequestMapping(value = "/api/profile-component/{id}", method = RequestMethod.GET, produces = {"application/json"})
  @PreAuthorize("AccessResource('PROFILECOMPONENT', #id, READ)")
  public ProfileComponent getProfileComponent(
          @PathVariable("id") String id,
          Authentication authentication) throws ProfileComponentNotFoundException  {
      return this.findById(id);
      
  }

  @RequestMapping(value = "/api/profile-component/{pcId}/context/{contextId}", method = RequestMethod.GET, produces = {"application/json"})
  @PreAuthorize("AccessResource('PROFILECOMPONENT', #pcId, READ)")
  public ProfileComponentContext getProfileComponentChild(
          @PathVariable("pcId") String pcId, @PathVariable("contextId") String contextId,
          Authentication authentication) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException  {
      return profileComponentService.findContextById(pcId, contextId);
  }
  
  @RequestMapping(value = "/api/profile-component/{pcId}/context/{contextId}/resources", method = RequestMethod.GET, produces = {"application/json"})
  @PreAuthorize("AccessResource('PROFILECOMPONENT', #pcId, READ)")
  public Set<Resource> getResources(
          @PathVariable("pcId") String pcId, @PathVariable("contextId") String contextId,
          Authentication authentication) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException  {
      return profileComponentService.getDependencies(pcId, contextId);
  }
  
  
  @RequestMapping(value = "/api/profile-component/{pcId}/context/{contextId}/update", method = RequestMethod.POST, produces = {"application/json"})
  @PreAuthorize("AccessResource('PROFILECOMPONENT', #pcId, WRITE)")
  @ResponseBody
  public ProfileComponentContext updateContext(
          @PathVariable("pcId") String pcId, @PathVariable("contextId") String contextId, @RequestBody ProfileComponentContext ctx,
          Authentication authentication) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException  {
      ProfileComponent pc = this.findById(pcId);
      ProfileComponentContext ret =  profileComponentService.updateContext(pc.getId(), contextId, ctx);
      this.dateUpdateService.updateDate(pc.getDocumentInfo());
      return ret;

  }

    @RequestMapping(value = "/api/profile-component/{pcId}/context/{contextId}/conformance-statements", method = RequestMethod.POST, produces = {"application/json"})
    @PreAuthorize("AccessResource('PROFILECOMPONENT', #pcId, WRITE)")
    @ResponseBody
    public List<PropertyConformanceStatement> updateContextConformanceStatements(
            @PathVariable("pcId") String pcId, @PathVariable("contextId") String contextId, @RequestBody List<PropertyConformanceStatement> conformanceStatements,
            Authentication authentication) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException  {
        return profileComponentService.updateContextConformanceStatements(pcId, contextId, conformanceStatements);
    }

    @RequestMapping(value = "/api/profile-component/{pcId}/context/{contextId}/co-constraints", method = RequestMethod.POST, produces = {"application/json"})
    @PreAuthorize("AccessResource('PROFILECOMPONENT', #pcId, WRITE)")
    @ResponseBody
    public ProfileComponentContext updateContextCoConstraints(
            @PathVariable("pcId") String pcId, @PathVariable("contextId") String contextId, @RequestBody PropertyCoConstraintBindings coConstraintBindings,
            Authentication authentication) throws Exception  {
        ProfileComponent pc = this.findById(pcId);
        ProfileComponentContext ret = profileComponentService.updateContextCoConstraintBindings(pc.getId(), contextId, coConstraintBindings);
        this.dateUpdateService.updateDate(pc.getDocumentInfo());
        return ret;
    }

    @RequestMapping(value = "/api/profile-component/{pcId}/context/{contextId}/co-constraints", method = RequestMethod.DELETE, produces = {"application/json"})
    @PreAuthorize("AccessResource('PROFILECOMPONENT', #pcId, WRITE)")
    @ResponseBody
    public ProfileComponentContext removeContextCoConstraints(
            @PathVariable("pcId") String pcId, @PathVariable("contextId") String contextId,
            Authentication authentication) throws Exception  {
        ProfileComponent pc = this.findById(pcId);
        ProfileComponentContext ret = profileComponentService.updateContextCoConstraintBindings(pcId, contextId, null);
        this.dateUpdateService.updateDate(pc.getDocumentInfo());
        return ret;

    }
  
    @RequestMapping(value = "/api/profile-component/{pcId}/context/{contextId}/dynamic-mapping", method = RequestMethod.POST, produces = {"application/json"})
    @PreAuthorize("AccessResource('PROFILECOMPONENT', #pcId, WRITE)")
    @ResponseBody
    public PropertyDynamicMapping updateDynamicMapping(
            @PathVariable("pcId") String pcId, @PathVariable("contextId") String contextId, @RequestBody PropertyDynamicMapping dynamicMapping,
            Authentication authentication) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException  {
        ProfileComponent pc = this.findById(pcId);
        PropertyDynamicMapping ret = profileComponentService.updateContextDynamicMapping(pc, contextId, dynamicMapping);
        this.dateUpdateService.updateDate(pc.getDocumentInfo());
    	return ret;
    }

  @RequestMapping(value = "/api/profile-component/{id}", method = RequestMethod.POST, produces = {
          "application/json" })
  @PreAuthorize("AccessResource('PROFILECOMPONENT', #id, WRITE)")
  @ResponseBody
  public ResponseMessage<?> applyChanges(@PathVariable("id") String id, @RequestBody List<ChangeItemDomain> cItems,
                                         Authentication authentication) throws Exception {
    
      ProfileComponent cp = this.profileComponentService.findById(id);
      this.profileComponentService.applyChanges(cp, cItems);
      dateUpdateService.updateDate(cp.getDocumentInfo());

      return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, cp.getId(), new Date());
  }
  
  private ProfileComponent findById(String id) throws ProfileComponentNotFoundException {
    ProfileComponent pc = profileComponentService.findById(id);
    if (pc == null) {
        throw new ProfileComponentNotFoundException(id);
    }
    return pc;
 }


}
