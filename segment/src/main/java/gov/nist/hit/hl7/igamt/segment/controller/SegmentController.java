package gov.nist.hit.hl7.igamt.segment.controller;

import java.util.List;

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
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Type;
import gov.nist.hit.hl7.igamt.common.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;


@RestController
public class SegmentController extends BaseController {

  Logger log = LoggerFactory.getLogger(SegmentController.class);


  @Autowired
  SegmentService segmentService;


  public SegmentController() {}



  @RequestMapping(value = "/api/segments/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public SegmentStructure getSegmentStructure(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertDomainToStructure(segment);

  }


  @RequestMapping(value = "/api/segments/{id}/conformancestatement", method = RequestMethod.GET,
      produces = {"application/json"})

  public SegmentConformanceStatement getSegmentConformanceStatement(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertDomainToConformanceStatement(segment);

  }

  @RequestMapping(value = "/api/segments/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})

  public DisplayMetadata getSegmentMetadata(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertDomainToMetadata(segment);

  }

  @RequestMapping(value = "/api/segments/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})
  public PreDef getSegmentPredef(@PathVariable("id") String id, Authentication authentication)
      throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertDomainToPredef(segment);

  }

  @RequestMapping(value = "/api/segments/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody PostDef getSegmentPostdef(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertDomainToPostdef(segment);
  }


  @RequestMapping(value = "/api/segments/{id}/structure", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveStucture(@PathVariable("id") String id,
      @RequestBody SegmentStructure structure, Authentication authentication)
      throws ValidationException, SegmentException, ForbiddenOperationException,
      SegmentNotFoundException {
    log.debug("Saving segment with id=" + id);
    if (!Scope.HL7STANDARD.equals(structure.getScope())) {
      Segment segment = segmentService.convertToSegment(structure);
      if (segment == null) {
        throw new SegmentNotFoundException(id);
      }
      segment = segmentService.save(segment);
      return new ResponseMessage(Type.SUCCESS, STRUCTURE_SAVED, id, segment.getUpdateDate());
    } else {
      throw new ForbiddenOperationException("FORBIDDEN_SAVE_SEGMENT");
    }
  }

  @RequestMapping(value = "/api/segments/{id}/predef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePredef(@PathVariable("id") String id, @RequestBody PreDef preDef,
      Authentication authentication) throws ValidationException, SegmentNotFoundException {
    Segment segment = segmentService.savePredef(preDef);
    return new ResponseMessage(Type.SUCCESS, PREDEF_SAVED, id, segment.getUpdateDate());
  }

  @RequestMapping(value = "/api/segments/{id}/postdef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePostdef(@PathVariable("id") String id, @RequestBody PostDef postDef,
      Authentication authentication) throws ValidationException, SegmentNotFoundException {
    Segment segment = segmentService.savePostdef(postDef);
    return new ResponseMessage(Type.SUCCESS, POSTDEF_SAVED, id, segment.getUpdateDate());
  }


  @RequestMapping(value = "/api/segments/{id}/metadata", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveSegmentMetadata(@PathVariable("id") String id,
      @RequestBody DisplayMetadata displayMetadata, Authentication authentication)
      throws ValidationException, SegmentNotFoundException {
    Segment segment = segmentService.saveMetadata(displayMetadata);
    return new ResponseMessage(Type.SUCCESS, METADATA_SAVED, id, segment.getUpdateDate());
  }


  @RequestMapping(value = "/api/segments/{id}/conformancestatement", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveConformanceStatement(@PathVariable("id") String id,
      Authentication authentication, @RequestBody SegmentConformanceStatement conformanceStatement)
      throws SegmentValidationException, SegmentNotFoundException {
    Segment segment = segmentService.saveConformanceStatement(conformanceStatement);
    return new ResponseMessage(Type.SUCCESS, CONFORMANCESTATEMENT_SAVED, id,
        segment.getUpdateDate());

  }

  @RequestMapping(value = "/api/segments/hl7/{version:.+}", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody List<Segment> find(@PathVariable String version,
      Authentication authentication) {
    return segmentService.findDisplayFormatByScopeAndVersion(Scope.HL7STANDARD.toString(), version);
  }



  private Segment findById(String id) throws SegmentNotFoundException {
    Segment segment = segmentService.findLatestById(id);
    if (segment == null) {
      throw new SegmentNotFoundException(id);
    }
    return segment;
  }



}
