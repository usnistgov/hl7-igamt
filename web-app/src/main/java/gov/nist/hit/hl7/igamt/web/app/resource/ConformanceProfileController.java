package gov.nist.hit.hl7.igamt.web.app.resource;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.access.active.NotifySave;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
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
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.service.verification.VerificationService;
import gov.nist.hit.hl7.igamt.web.app.service.DateUpdateService;

@RestController
public class ConformanceProfileController extends BaseController {

    @Autowired
    private ConformanceProfileService conformanceProfileService;

    @Autowired
    EntityChangeService entityChangeService;
    
	@Autowired
	DateUpdateService dateUpdateService;
	
	@Autowired
	VerificationService verificationService;

	@Autowired
	private ConformanceProfileDependencyService conformanceProfileDependencyService;

	public ConformanceProfileController() {}

    private boolean getReadOnly(Authentication authentication, ConformanceProfile cp) {
        if (cp.getUsername() == null) {
            return true;
        } else {
            return !cp.getUsername().equals(authentication.getName());
        }

    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/resources", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
    public Set<Resource> getResources(@PathVariable("id") String id) {
        ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);
        return conformanceProfileService.getDependencies(conformanceProfile);
    }

	@RequestMapping(value = "/api/conformanceprofiles/{id}/coconstraints/group", method = RequestMethod.GET, produces = {"application/json" })
	@PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
	public Set<Resource> getConformanceProfileStructure(@PathVariable("id") String id) throws EntityNotFound {
		ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);
		return new HashSet<>(conformanceProfileDependencyService.getCoConstraintGroupDependencies(conformanceProfile).values());
	}

    @RequestMapping(value = "/api/conformanceprofiles/{id}/conformancestatement/{did}", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
    public ConformanceProfileConformanceStatement getConformanceProfileConformanceStatement(
            @PathVariable("id") String id,
            @PathVariable("did") String did,
            Authentication authentication
    ) throws ConformanceProfileNotFoundException {
        ConformanceProfile conformanceProfile = findById(id);
        return conformanceProfileService.convertDomainToConformanceStatement(
				conformanceProfile,
				did,
                getReadOnly(authentication, conformanceProfile)
        );
    }

    private ConformanceProfile findById(String id) throws ConformanceProfileNotFoundException {
        ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);
        if (conformanceProfile == null) {
            throw new ConformanceProfileNotFoundException(id);
        }
        return conformanceProfile;
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/api/conformanceprofiles/{id}", method = RequestMethod.POST, produces = {"application/json" })
    @NotifySave(id = "#id", type = "'CONFORMANCEPROFILE'")
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, WRITE) && ConcurrentSync('CONFORMANCEPROFILE', #id, ALLOW_SYNC_STRICT)")
    @ResponseBody
    public ResponseMessage<?> applyChanges(
			@PathVariable("id") String id,
			@RequestBody List<ChangeItemDomain> cItems
    ) throws Exception {
        ConformanceProfile cp = this.conformanceProfileService.findById(id);
        this.conformanceProfileService.applyChanges(cp, cItems);
		dateUpdateService.updateDate(cp.getDocumentInfo());
        return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, cp.getId(), new Date());
    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}", method = RequestMethod.GET, produces = {"application/json"})
    @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
    public ConformanceProfile getConformanceProfile(@PathVariable("id") String id) throws ConformanceProfileNotFoundException {
        return this.findById(id);
    }

    
	@RequestMapping(value = "/api/conformanceprofiles/{id}/verification", method = RequestMethod.GET, produces = {"application/json" })
	@PreAuthorize("AccessResource('CONFORMANCEPROFILE', #id, READ)")
	public @ResponseBody List<IgamtObjectError> verifyById(@PathVariable("id") String id) {
		ConformanceProfile cp = this.conformanceProfileService.findById(id);
		if (cp != null) {
			return this.verificationService.verifyConformanceProfile(cp);
		}
		return null;
	}

}