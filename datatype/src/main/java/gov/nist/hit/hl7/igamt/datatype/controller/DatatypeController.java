package gov.nist.hit.hl7.igamt.datatype.controller;

import java.util.List;

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
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructure;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeValidationException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;


@RestController
public class DatatypeController extends BaseController {


  Logger log = LoggerFactory.getLogger(DatatypeController.class);

  @Autowired
  private DatatypeService datatypeService;



  private static final String STRUCTURE_SAVED = "STRUCTURE_SAVED";
  private static final String PREDEF_SAVED = "PREDEF_SAVED";
  private static final String POSTDEF_SAVED = "POSTDEF_SAVED";
  private static final String METADATA_SAVED = "METADATA_SAVED";
  private static final String CONFORMANCESTATEMENT_SAVED = "CONFORMANCESTATEMENT_SAVED";


  public DatatypeController() {}

  @RequestMapping(value = "/api/datatypes/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public DatatypeStructure getDatatypeStructure(@PathVariable("id") String id,
      Authentication authentication) throws DatatypeNotFoundException {
    Datatype datatype = findById(id);
    return datatypeService.convertDomainToStructure(datatype);

  }

  @RequestMapping(value = "/api/datatypes/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})
  public DisplayMetadata getDatatypeMetadata(@PathVariable("id") String id,
      Authentication authentication) throws DatatypeNotFoundException {
    Datatype Datatype = findById(id);
    return datatypeService.convertDomainToMetadata(Datatype);

  }

  @RequestMapping(value = "/api/datatypes/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public PreDef getDatatypePredef(@PathVariable("id") String id, Authentication authentication)
      throws DatatypeNotFoundException {
    Datatype Datatype = findById(id);
    return datatypeService.convertDomainToPredef(Datatype);

  }

  @RequestMapping(value = "/api/datatypes/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public PostDef getDatatypePostdef(@PathVariable("id") String id, Authentication authentication)
      throws DatatypeNotFoundException {
    Datatype Datatype = findById(id);
    return datatypeService.convertDomainToPostdef(Datatype);

  }

  @RequestMapping(value = "/api/datatypes/{id}/conformancestatement", method = RequestMethod.GET,
      produces = {"application/json"})
  public DatatypeConformanceStatement getDatatypeConformanceStatement(@PathVariable("id") String id,
      Authentication authentication) throws DatatypeNotFoundException {
    Datatype datatype = findById(id);
    return datatypeService.convertDomainToConformanceStatement(datatype);
  }



  @RequestMapping(value = "/api/datatypes/{id}/structure", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveStucture(@PathVariable("id") String id,
      @RequestBody DatatypeStructure structure, Authentication authentication)
      throws ValidationException, DatatypeException, ForbiddenOperationException,
      DatatypeNotFoundException {
    log.debug("Saving Datatype with id=" + id);
    if (!Scope.HL7STANDARD.equals(structure.getScope())) {
      Datatype Datatype = datatypeService.convertToDatatype(structure);
      if (Datatype == null) {
        throw new DatatypeNotFoundException(id);
      }
      Datatype = datatypeService.save(Datatype);
      return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, id, Datatype.getUpdateDate());
    } else {
      throw new ForbiddenOperationException("FORBIDDEN_SAVE_Datatype");
    }
  }

  @RequestMapping(value = "/api/datatypes/{id}/predef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePredef(@PathVariable("id") String id, @RequestBody PreDef preDef,
      Authentication authentication) throws ValidationException, DatatypeNotFoundException {
    Datatype Datatype = datatypeService.savePredef(preDef);
    return new ResponseMessage(Status.SUCCESS, PREDEF_SAVED, id, Datatype.getUpdateDate());
  }

  @RequestMapping(value = "/api/datatypes/{id}/postdef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePostdef(@PathVariable("id") String id, @RequestBody PostDef postDef,
      Authentication authentication) throws ValidationException, DatatypeNotFoundException {
    Datatype Datatype = datatypeService.savePostdef(postDef);
    return new ResponseMessage(Status.SUCCESS, POSTDEF_SAVED, id, Datatype.getUpdateDate());
  }


  @RequestMapping(value = "/api/datatypes/{id}/metadata", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveDatatypeMetadata(@PathVariable("id") String id,
      @RequestBody DisplayMetadata displayMetadata, Authentication authentication)
      throws ValidationException, DatatypeNotFoundException {
    Datatype Datatype = datatypeService.saveMetadata(displayMetadata);
    return new ResponseMessage(Status.SUCCESS, METADATA_SAVED, id, Datatype.getUpdateDate());
  }


  @RequestMapping(value = "/api/datatypes/{id}/conformancestatement", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveConformanceStatement(@PathVariable("id") String id,
      Authentication authentication, @RequestBody DatatypeConformanceStatement conformanceStatement)
      throws DatatypeValidationException, DatatypeNotFoundException {
    Datatype Datatype = datatypeService.saveConformanceStatement(conformanceStatement);
    return new ResponseMessage(Status.SUCCESS, CONFORMANCESTATEMENT_SAVED, id,
        Datatype.getUpdateDate());

  }



  @RequestMapping(value = "/api/datatypes/hl7/{version:.+}", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody List<Datatype> findHl7Datatypes(@PathVariable String version,
      Authentication authentication) {
    return datatypeService.findDisplayFormatByScopeAndVersion(Scope.HL7STANDARD.toString(),
        version);
  }


  private Datatype findById(String id) throws DatatypeNotFoundException {
    Datatype Datatype = datatypeService.findLatestById(id);
    if (Datatype == null) {
      throw new DatatypeNotFoundException(id);
    }
    return Datatype;
  }



}
