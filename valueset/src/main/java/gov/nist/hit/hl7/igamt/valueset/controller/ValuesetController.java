package gov.nist.hit.hl7.igamt.valueset.controller;

import java.util.List;
import java.util.Set;

import org.apache.xerces.impl.dv.DatatypeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.display.DisplayCode;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetMetadata;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetPostDef;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetPreDef;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetStructure;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;


@RestController
public class ValuesetController extends BaseController {

  Logger log = LoggerFactory.getLogger(ValuesetController.class);

  @Autowired
  ValuesetService valuesetService;

  private static final String STRUCTURE_SAVED = "STRUCTURE_SAVED";
  private static final String PREDEF_SAVED = "PREDEF_SAVED";
  private static final String POSTDEF_SAVED = "POSTDEF_SAVED";
  private static final String METADATA_SAVED = "METADATA_SAVED";

  public ValuesetController() {}

  @RequestMapping(value = "/api/valuesets/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public ValuesetStructure getValuesetStructure(@PathVariable("id") String id,
      Authentication authentication) throws ValuesetNotFoundException {
    Valueset valueset = findById(id);
    return valuesetService.convertDomainToStructure(valueset);

  }


  @RequestMapping(value = "/api/valuesets/{id}/codes", method = RequestMethod.GET,
      produces = {"application/json"})

  public Set<DisplayCode> getCodes(@PathVariable("id") String id, Authentication authentication)
      throws ValuesetNotFoundException {
    Valueset valueset = findById(id);
    return valuesetService.getCodeDisplay(valueset);

  }

  @RequestMapping(value = "/api/valuesets/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})
  public ValuesetMetadata getValueseteMetadata(@PathVariable("id") String id,
      Authentication authentication) throws ValuesetNotFoundException {
    Valueset valueset = findById(id);
    return valuesetService.convertDomainToMetadata(valueset);

  }

  @RequestMapping(value = "/api/valuesets/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public ValuesetPreDef getDatatypePredef(@PathVariable("id") String id,
      Authentication authentication) throws ValuesetNotFoundException {
    Valueset valueset = findById(id);
    return valuesetService.convertDomainToPredef(valueset);

  }

  @RequestMapping(value = "/api/valuesets/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public ValuesetPostDef getDatatypePostdef(@PathVariable("id") String id,
      Authentication authentication) throws ValuesetNotFoundException {
    Valueset valueset = findById(id);
    return valuesetService.convertDomainToPostdef(valueset);

  }

  @RequestMapping(value = "/api/valuesets/{id}/structure", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveStucture(@PathVariable("id") String id,
      @RequestBody ValuesetStructure structure, Authentication authentication)
      throws ValidationException, DatatypeException, ForbiddenOperationException,
      ValuesetNotFoundException {
    log.debug("Saving Datatype with id=" + id);
    if (!Scope.HL7STANDARD.equals(structure.getScope())) {
      Valueset valueset = valuesetService.convertToValueset(structure);
      if (valueset == null) {
        throw new ValuesetNotFoundException(id);
      }
      valueset = valuesetService.save(valueset);
      return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, id, valueset.getUpdateDate());
    } else {
      throw new ForbiddenOperationException("FORBIDDEN_SAVE_Datatype");
    }
  }

  @RequestMapping(value = "/api/valuesets/{id}/predef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePredef(@PathVariable("id") String id,
      @RequestBody ValuesetPreDef preDef, Authentication authentication)
      throws ValidationException, ValuesetNotFoundException {
    Valueset valueset = valuesetService.savePredef(preDef);
    return new ResponseMessage(Status.SUCCESS, PREDEF_SAVED, id, valueset.getUpdateDate());
  }

  @RequestMapping(value = "/api/valuesets/{id}/postdef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePostdef(@PathVariable("id") String id,
      @RequestBody ValuesetPostDef postDef, Authentication authentication)
      throws ValidationException, ValuesetNotFoundException {
    Valueset valueset = valuesetService.savePostdef(postDef);
    return new ResponseMessage(Status.SUCCESS, POSTDEF_SAVED, id, valueset.getUpdateDate());
  }


  @RequestMapping(value = "/api/valuesets/{id}/metadata", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveDatatypeMetadata(@PathVariable("id") String id,
      @RequestBody ValuesetMetadata displayMetadata, Authentication authentication)
      throws ValidationException, ValuesetNotFoundException {
    Valueset valueset = valuesetService.saveMetadata(displayMetadata);
    return new ResponseMessage(Status.SUCCESS, METADATA_SAVED, id, valueset.getUpdateDate());
  }

  @RequestMapping(value = "/api/valuesets/{scope}/{version:.+}", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody ResponseMessage<List<Valueset>> findHl7ValueSets(@PathVariable String version,@PathVariable String scope,
      Authentication authentication) {
    return new ResponseMessage<List<Valueset>>(Status.SUCCESS, "",
          "", null, false, null, valuesetService.findDisplayFormatByScopeAndVersion(scope,version));
  }

  private Valueset findById(String id) throws ValuesetNotFoundException {
    Valueset valueset = valuesetService.findById(id);
    if (valueset == null) {
      throw new ValuesetNotFoundException(id);
    }
    return valueset;
  }

}
