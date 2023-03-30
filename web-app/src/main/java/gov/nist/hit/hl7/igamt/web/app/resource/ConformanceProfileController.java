package gov.nist.hit.hl7.igamt.web.app.resource;

import java.util.Date;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.access.active.NotifySave;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CPVerificationResult;
import gov.nist.hit.hl7.igamt.ig.service.VerificationService;
import gov.nist.hit.hl7.igamt.web.app.service.DateUpdateService;

@RestController
public class ConformanceProfileController extends BaseController {

    Logger log = LoggerFactory.getLogger(ConformanceProfileController.class);

    @Autowired
    private ConformanceProfileService conformanceProfileService;

    @Autowired
    EntityChangeService entityChangeService;

    @Autowired 
    CommonService commonService;
    
	@Autowired
	DateUpdateService dateUpdateService;
	
	@Autowired
	VerificationService verificationService;
    
    public ConformanceProfileController() {
        // TODO Auto-generated constructor stub
    }

    private boolean getReadOnly(Authentication authentication, ConformanceProfile cp) {
        // TODO Auto-generated method stub
        if (cp.getUsername() == null) {
            return true;
        } else {
            return !cp.getUsername().equals(authentication.getName());
        }

    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/resources", method = RequestMethod.GET, produces = {
            "application/json" })
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
    public Set<Resource> getResources(@PathVariable("id") String id, Authentication authentication) {
        ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);
        return conformanceProfileService.getDependencies(conformanceProfile);
    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/structure/{contextId}", method = RequestMethod.GET, produces = {
            "application/json" })
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
    public ConformanceProfileStructureDisplay getConformanceProfileStructure(@PathVariable("id") String id,
                                                                             @PathVariable("contextId") String contextId, Authentication authentication) {
        ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);

        return conformanceProfileService.convertDomainToDisplayStructureFromContext(conformanceProfile, contextId,
                getReadOnly(authentication, conformanceProfile));

    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/conformancestatement/{did}", method = RequestMethod.GET, produces = {
            "application/json" })
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
    public ConformanceProfileConformanceStatement getConformanceProfileConformanceStatement(
            @PathVariable("id") String id, @PathVariable("did") String did, Authentication authentication)
            throws ConformanceProfileNotFoundException {
        ConformanceProfile conformanceProfile = findById(id);
        return conformanceProfileService.convertDomainToConformanceStatement(conformanceProfile, did,
                getReadOnly(authentication, conformanceProfile));

    }

    /**
     *
     * @param id
     * @return
     * @throws ConformanceProfileNotFoundException
     */
    private ConformanceProfile findById(String id) throws ConformanceProfileNotFoundException {
        ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);
        if (conformanceProfile == null) {
            throw new ConformanceProfileNotFoundException(id);
        }
        return conformanceProfile;
    }

    public ConformanceProfileService getConformanceProfileService() {
        return conformanceProfileService;
    }

    public void setConformanceProfileService(ConformanceProfileService conformanceProfileService) {
        this.conformanceProfileService = conformanceProfileService;
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/api/conformanceprofiles/{id}", method = RequestMethod.POST, produces = {
            "application/json" })
    @NotifySave(id = "#id", type = "'CONFORMANCEPROFILE'")
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, WRITE) && ConcurrentSync('CONFORMANCEPROFILE', #id, ALLOW_SYNC_STRICT)")
    @ResponseBody
    public ResponseMessage<?> applyChanges(@PathVariable("id") String id, @RequestBody List<ChangeItemDomain> cItems,
                                           Authentication authentication) throws Exception {
        ConformanceProfile cp = this.conformanceProfileService.findById(id);
        this.conformanceProfileService.applyChanges(cp, cItems);
		dateUpdateService.updateDate(cp.getDocumentInfo());
        return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, cp.getId(), new Date());
    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}", method = RequestMethod.GET,
            produces = {"application/json"})
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
    public ConformanceProfile getConformanceProfile(
            @PathVariable("id") String id, Authentication authentication) throws ConformanceProfileNotFoundException {
        return this.findById(id);
    }

    
	@RequestMapping(value = "/api/conformanceprofiles/{ig}/verification", method = RequestMethod.GET, produces = {
			"application/json" })
	@PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
	public @ResponseBody CPVerificationResult verifyById(@PathVariable("id") String id, Authentication authentication) {
		ConformanceProfile cp = this.conformanceProfileService.findById(id);
		if (cp != null) {
			CPVerificationResult report = this.verificationService.verifyConformanceProfile(cp);
			return report;
		}
		return null;
	}

}