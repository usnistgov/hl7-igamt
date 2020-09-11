package gov.nist.hit.hl7.igamt.conformanceprofile.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.DefinitionDisplay;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityType;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfileMetadata;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeException;

@RestController
public class ConformanceProfileController extends BaseController {

    Logger log = LoggerFactory.getLogger(ConformanceProfileController.class);

    @Autowired
    private ConformanceProfileService conformanceProfileService;

    @Autowired
    EntityChangeService entityChangeService;

    @Autowired 
    CommonService commonService;
    
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

    @RequestMapping(value = "/api/conformanceprofiles/{id}/structure", method = RequestMethod.GET, produces = {
            "application/json" })

    public ConformanceProfileStructureDisplay getConformanceProfileStructure(@PathVariable("id") String id,
                                                                             Authentication authentication) {
        ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);
        System.out.println("START!!!");
        System.out.println(conformanceProfile.getBinding());
        return conformanceProfileService.convertDomainToDisplayStructure(conformanceProfile,
                getReadOnly(authentication, conformanceProfile));

    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/resources", method = RequestMethod.GET, produces = {
            "application/json" })

    public Set<Resource> getResources(@PathVariable("id") String id, Authentication authentication) {
        ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);

        return conformanceProfileService.getDependencies(conformanceProfile);

    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/structure/{contextId}", method = RequestMethod.GET, produces = {
            "application/json" })

    public ConformanceProfileStructureDisplay getConformanceProfileStructure(@PathVariable("id") String id,
                                                                             @PathVariable("contextId") String contextId, Authentication authentication) {
        ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);

        return conformanceProfileService.convertDomainToDisplayStructureFromContext(conformanceProfile, contextId,
                getReadOnly(authentication, conformanceProfile));

    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/metadata", method = RequestMethod.GET, produces = {
            "application/json" })

    public DisplayConformanceProfileMetadata getConformanceProfileMetadata(@PathVariable("id") String id,
                                                                           Authentication authentication) throws ConformanceProfileNotFoundException {
        ConformanceProfile conformanceProfile = findById(id);
        DisplayConformanceProfileMetadata display = new DisplayConformanceProfileMetadata();
        display.complete(conformanceProfile, SectionType.METADATA, getReadOnly(authentication, conformanceProfile));
        return display;
    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/predef", method = RequestMethod.GET, produces = {
            "application/json" })

    public DefinitionDisplay getConformanceProfilePredef(@PathVariable("id") String id, Authentication authentication)
            throws ConformanceProfileNotFoundException {
        ConformanceProfile conformanceProfile = findById(id);
        DefinitionDisplay display = new DefinitionDisplay();
        display.build(conformanceProfile, SectionType.PREDEF, getReadOnly(authentication, conformanceProfile));
        return display;

    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/postdef", method = RequestMethod.GET, produces = {
            "application/json" })

    public DefinitionDisplay getConformanceProfilePostdef(@PathVariable("id") String id, Authentication authentication)
            throws ConformanceProfileNotFoundException {
        ConformanceProfile conformanceProfile = findById(id);
        DefinitionDisplay display = new DefinitionDisplay();
        display.build(conformanceProfile, SectionType.POSTDEF, getReadOnly(authentication, conformanceProfile));
        return display;
    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}/conformancestatement/{did}", method = RequestMethod.GET, produces = {
            "application/json" })

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

    @RequestMapping(value = "/api/conformanceprofiles/{id}", method = RequestMethod.POST, produces = {
            "application/json" })
    @ResponseBody
    public ResponseMessage<?> applyChanges(@PathVariable("id") String id,
                                           @RequestParam(name = "dId", required = true) String documentId, @RequestBody List<ChangeItemDomain> cItems,
                                           Authentication authentication) throws Exception {
      
        ConformanceProfile cp = this.conformanceProfileService.findById(id);
        commonService.checkRight(authentication, cp.getCurrentAuthor(), cp.getUsername());
        validateSaveOperation(cp);
        this.conformanceProfileService.applyChanges(cp, cItems, documentId);
        EntityChangeDomain entityChangeDomain = new EntityChangeDomain();
        entityChangeDomain.setDocumentId(documentId);
        entityChangeDomain.setDocumentType(DocumentType.IG);
        entityChangeDomain.setTargetId(id);
        entityChangeDomain.setTargetType(EntityType.CONFORMANCEPROFILE);
        entityChangeDomain.setChangeItems(cItems);
        entityChangeDomain.setTargetVersion(cp.getVersion());
        entityChangeService.save(entityChangeDomain);
        return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, cp.getId(), new Date());
    }

    private void validateSaveOperation(ConformanceProfile cp) throws ForbiddenOperationException {
        if (Scope.HL7STANDARD.equals(cp.getDomainInfo().getScope())) {
            throw new ForbiddenOperationException("FORBIDDEN_SAVE_CONFORMANCEPROFILE");
        }
    }

    @RequestMapping(value = "/api/conformanceprofiles/{id}", method = RequestMethod.GET,
            produces = {"application/json"})

    public ConformanceProfile getConformanceProfile(
            @PathVariable("id") String id, Authentication authentication) throws ConformanceProfileNotFoundException {
        return this.findById(id);
    }


}