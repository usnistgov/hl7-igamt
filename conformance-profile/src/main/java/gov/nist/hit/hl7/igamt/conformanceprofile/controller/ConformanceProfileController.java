package gov.nist.hit.hl7.igamt.conformanceprofile.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileSaveStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfileMetadata;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePostDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePreDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileException;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileValidationException;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;


@RestController
public class ConformanceProfileController extends BaseController {

  Logger log = LoggerFactory.getLogger(ConformanceProfileController.class);

  @Autowired
  private ConformanceProfileService conformanceProfileService;

  public ConformanceProfileController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public ConformanceProfileStructure getConformanceProfileStructure(@PathVariable("id") String id,
      Authentication authentication) {
    ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
    return conformanceProfileService.convertDomainToStructure(conformanceProfile);

  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})

  public DisplayConformanceProfileMetadata getConformanceProfileMetadata(
      @PathVariable("id") String id, Authentication authentication)
      throws ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = findById(id);
    return conformanceProfileService.convertDomainToMetadata(conformanceProfile);

  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public DisplayConformanceProfilePreDef getConformanceProfilePredef(@PathVariable("id") String id,
      Authentication authentication) throws ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = findById(id);
    return conformanceProfileService.convertDomainToPredef(conformanceProfile);

  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public DisplayConformanceProfilePostDef getConformanceProfilePostdef(
      @PathVariable("id") String id, Authentication authentication)
      throws ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = findById(id);
    return conformanceProfileService.convertDomainToPostdef(conformanceProfile);

  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/conformancestatement", method = RequestMethod.GET, 
      produces = {"application/json"})

  public ConformanceProfileConformanceStatement getConformanceProfileConformanceStatement(
      @PathVariable("id") String id, Authentication authentication)
      throws ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = findById(id);
    return conformanceProfileService.convertDomainToConformanceStatement(conformanceProfile);

  }


  @RequestMapping(value = "/api/conformanceprofiles/{id}/structure", method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage saveStucture(@PathVariable("id") String id,
      @RequestBody ConformanceProfileSaveStructure structure, Authentication authentication)
      throws ValidationException, ConformanceProfileException, ForbiddenOperationException,
      ConformanceProfileNotFoundException {
    log.debug("Saving conformanceProfile with id=" + id);
      
    System.out.println(structure.getChildren().size());
    ConformanceProfile conformanceProfile =
        conformanceProfileService.convertToConformanceProfile(structure);
    if (conformanceProfile == null) {
      throw new ConformanceProfileNotFoundException(id);
    }
    conformanceProfile = conformanceProfileService.save(conformanceProfile);
    return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, id,
        conformanceProfile.getUpdateDate());
    
  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/predef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePredef(@PathVariable("id") String id, @RequestBody PreDef preDef,
      Authentication authentication)
      throws ValidationException, ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = conformanceProfileService.savePredef(preDef);
    return new ResponseMessage(Status.SUCCESS, PREDEF_SAVED, id,
        conformanceProfile.getUpdateDate());
  }

  @RequestMapping(value = "/api/conformanceprofiles/{id}/postdef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePostdef(@PathVariable("id") String id, @RequestBody PostDef postDef,
      Authentication authentication)
      throws ValidationException, ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = conformanceProfileService.savePostdef(postDef);
    return new ResponseMessage(Status.SUCCESS, POSTDEF_SAVED, id,
        conformanceProfile.getUpdateDate());
  }


  @RequestMapping(value = "/api/conformanceprofiles/{id}/metadata", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveConformanceProfileMetadata(@PathVariable("id") String id,
      @RequestBody DisplayConformanceProfileMetadata displayMetadata, Authentication authentication)
      throws ValidationException, ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = conformanceProfileService.saveMetadata(displayMetadata);
    return new ResponseMessage(Status.SUCCESS, METADATA_SAVED, id,
        conformanceProfile.getUpdateDate());
  }


  @RequestMapping(value = "/api/conformanceprofiles/{id}/conformancestatement",
      method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage saveConformanceStatement(@PathVariable("id") String id,
      Authentication authentication,
      @RequestBody ConformanceProfileConformanceStatement conformanceStatement)
      throws ConformanceProfileValidationException, ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile =
        conformanceProfileService.saveConformanceStatement(conformanceStatement);
    return new ResponseMessage(Status.SUCCESS, CONFORMANCESTATEMENT_SAVED, id,
        conformanceProfile.getUpdateDate());

  }



  /**
   * 
   * @param id
   * @return
   * @throws ConformanceProfileNotFoundException
   */
  private ConformanceProfile findById(String id) throws ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = conformanceProfileService.findLatestById(id);
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



}
