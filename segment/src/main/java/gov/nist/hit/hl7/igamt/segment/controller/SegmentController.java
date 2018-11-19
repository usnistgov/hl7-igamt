package gov.nist.hit.hl7.igamt.segment.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;

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

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityType;
import gov.nist.hit.hl7.igamt.common.config.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentDynamicMapping;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;
import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import javassist.NotFoundException;


@RestController
public class SegmentController extends BaseController {

  Logger log = LoggerFactory.getLogger(SegmentController.class);


  @Autowired
  SegmentService segmentService;
  @Autowired
  CoConstraintService coconstraintService;
  @Autowired
  EntityChangeService entityChangeService;


  public SegmentController() {}


  @RequestMapping(value = "/api/segments/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public SegmentStructureDisplay getSegmenDisplayStructure(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertDomainToDisplayStructure(segment);
  }

  @RequestMapping(value = "/api/segments/{id}/conformancestatement", method = RequestMethod.GET,
      produces = {"application/json"})
  public SegmentConformanceStatement getSegmentConformanceStatement(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertDomainToConformanceStatement(segment);
  }

  @RequestMapping(value = "/api/segments/{id}/dynamicmapping", method = RequestMethod.GET,
      produces = {"application/json"})
  public SegmentDynamicMapping getSegmentDynamicMapping(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertDomainToSegmentDynamicMapping(segment);
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



  // @RequestMapping(value = "/api/segments/{id}/structure", method = RequestMethod.POST,
  // produces = {"application/json"})
  // public ResponseMessage saveStucture(@PathVariable("id") String id,
  // @RequestBody SegmentStructure structure, Authentication authentication)
  // throws ValidationException, SegmentException, ForbiddenOperationException,
  // SegmentNotFoundException {
  // log.debug("Saving segment with id=" + id);
  // if (!Scope.HL7STANDARD.equals(structure.getScope())) {
  // Segment segment = segmentService.convertToSegment(structure);
  // if (segment == null) {
  // throw new SegmentNotFoundException(id);
  // }
  // segment = segmentService.save(segment);
  // return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, id, segment.getUpdateDate());
  // } else {
  // throw new ForbiddenOperationException("FORBIDDEN_SAVE_SEGMENT");
  // }
  // }

  @RequestMapping(value = "/api/segments/{id}/predef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePredef(@PathVariable("id") String id, @RequestBody PreDef preDef,
      Authentication authentication) throws ValidationException, SegmentNotFoundException {
    Segment segment = segmentService.savePredef(preDef);
    return new ResponseMessage(Status.SUCCESS, PREDEF_SAVED, id, segment.getUpdateDate());
  }

  @RequestMapping(value = "/api/segments/{id}/postdef", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage savePostdef(@PathVariable("id") String id, @RequestBody PostDef postDef,
      Authentication authentication) throws ValidationException, SegmentNotFoundException {
    Segment segment = segmentService.savePostdef(postDef);
    return new ResponseMessage(Status.SUCCESS, POSTDEF_SAVED, id, segment.getUpdateDate());
  }


  @RequestMapping(value = "/api/segments/{id}/metadata", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveSegmentMetadata(@PathVariable("id") String id,
      @RequestBody DisplayMetadata displayMetadata, Authentication authentication)
      throws ValidationException, SegmentNotFoundException {
    Segment segment = segmentService.saveMetadata(displayMetadata);
    return new ResponseMessage(Status.SUCCESS, METADATA_SAVED, id, segment.getUpdateDate());
  }


  @RequestMapping(value = "/api/segments/{id}/conformancestatement", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveConformanceStatement(@PathVariable("id") String id,
      Authentication authentication, @RequestBody SegmentConformanceStatement conformanceStatement)
      throws SegmentValidationException, SegmentNotFoundException {
    Segment segment = segmentService.saveConformanceStatement(conformanceStatement);
    return new ResponseMessage(Status.SUCCESS, CONFORMANCESTATEMENT_SAVED, id,
        segment.getUpdateDate());
  }

  @RequestMapping(value = "/api/segments/{id}/dynamicmapping", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage saveDynamicMapping(@PathVariable("id") String id,
      Authentication authentication, @RequestBody SegmentDynamicMapping dynamicMapping)
      throws SegmentValidationException, SegmentNotFoundException {
    Segment segment = segmentService.saveDynamicMapping(dynamicMapping);
    return new ResponseMessage(Status.SUCCESS, DYNAMICMAPPING_SAVED, id, segment.getUpdateDate());
  }



  @RequestMapping(value = "/api/segments/{id}/coconstraints", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public CoConstraintTable getCoConstraints(@PathVariable("id") String id,
      Authentication authentication) throws NotFoundException {
    return this.coconstraintService.getCoConstraintForSegment(id);
  }

  @RequestMapping(value = "/api/segments/{id}/coconstraints", method = RequestMethod.POST,
      produces = {"application/json"})
  @ResponseBody
  public ResponseMessage<CoConstraintTable> saveCoConstraints(@PathVariable("id") String id,
      @RequestBody CoConstraintTable table, Authentication authentication)
      throws CoConstraintSaveException {
    CoConstraintTable ccTable = this.coconstraintService.saveCoConstraintForSegment(id, table,
        authentication.getPrincipal().toString());
    return new ResponseMessage<CoConstraintTable>(Status.SUCCESS, "CoConstraint Table",
        "Saved Successfully", ccTable.getId(), false, new Date(), ccTable);
  }

  @RequestMapping(value = "/api/segments/hl7/{version:.+}", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody List<Segment> find(@PathVariable String version,
      Authentication authentication) {
    return segmentService.findDisplayFormatByScopeAndVersion(Scope.HL7STANDARD.toString(), version);
  }



  private Segment findById(String id) throws SegmentNotFoundException {
    Segment segment = segmentService.findById(id);
    if (segment == null) {
      throw new SegmentNotFoundException(id);
    }
    return segment;
  }

  @RequestMapping(value = "/api/segments/{id}/structure", method = RequestMethod.POST,
      produces = {"application/json"})
  @ResponseBody
  public ResponseMessage<?> applyStructureChanges(@PathVariable("id") String id,
      @RequestParam(name = "dId", required = true) String documentId,
      @RequestBody List<ChangeItemDomain> cItems, Authentication authentication)
      throws SegmentException, IOException {
    try {
      Segment s = this.segmentService.findById(id);
      validateSaveOperation(s);
      this.segmentService.applyChanges(s, cItems);
      EntityChangeDomain entityChangeDomain = new EntityChangeDomain();
      entityChangeDomain.setDocumentId(documentId);
      entityChangeDomain.setDocumentType(DocumentType.IG);
      entityChangeDomain.setTargetId(id);
      entityChangeDomain.setTargetType(EntityType.SEGMENT);
      entityChangeDomain.setChangeItems(cItems);
      entityChangeDomain.setTargetVersion(s.getVersion());
      entityChangeService.save(entityChangeDomain);
      return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, s.getId(), new Date());
    } catch (ForbiddenOperationException e) {
      throw new SegmentException(e);
    }
  }


  private void validateSaveOperation(Segment s) throws ForbiddenOperationException {
    if (Scope.HL7STANDARD.equals(s.getDomainInfo().getScope())) {
      throw new ForbiddenOperationException("FORBIDDEN_SAVE_SEGMENT");
    }
  }


}
