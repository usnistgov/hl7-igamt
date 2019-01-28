package gov.nist.hit.hl7.igamt.segment.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
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
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.model.DefinitionDisplay;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.config.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.common.constraint.model.ConformanceStatementDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.CoConstraintTableDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.DisplayMetadataSegment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentDynamicMapping;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.exception.CoConstraintNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;
import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;


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
    return segmentService.convertDomainToDisplayStructure(segment, getReadOnly(authentication, segment));
  }
  
  @RequestMapping(value = "/api/segments/{id}/{idPath}/{path}/structure-by-ref",
      method = RequestMethod.GET, produces = {"application/json"})
  public Set<?> getComponentStructure(@PathVariable("id") String id,
      @PathVariable("idPath") String idPath, @PathVariable("path") String path, Authentication authentication)
      throws SegmentNotFoundException {
    Segment segment = findById(id);
    return segmentService.convertSegmentStructurForMessage(segment, idPath, path);
  }

  @RequestMapping(value = "/api/segments/{id}/conformancestatement", method = RequestMethod.GET,
      produces = {"application/json"})
  public ConformanceStatementDisplay getSegmentConformanceStatement(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    
    ConformanceStatementDisplay conformanceStatementDisplay= new ConformanceStatementDisplay();
    Set<ConformanceStatement> cfs = new HashSet<ConformanceStatement>();
    if(segment.getBinding() !=null) {
    	cfs=segment.getBinding().getConformanceStatements();
    }
    conformanceStatementDisplay.complete(segment, SectionType.CONFORMANCESTATEMENTS, getReadOnly(authentication, segment), cfs);
    conformanceStatementDisplay.setType(Type.SEGMENT);
    return  conformanceStatementDisplay;
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

  public DisplayMetadataSegment getSegmentMetadata(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    DisplayMetadataSegment display= new DisplayMetadataSegment();
    display.complete(segment, SectionType.METADATA, getReadOnly(authentication, segment));
    return display;

  }

  @RequestMapping(value = "/api/segments/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})
  public DefinitionDisplay getSegmentPredef(@PathVariable("id") String id, Authentication authentication)
      throws SegmentNotFoundException {
    Segment segment = findById(id);
    DefinitionDisplay display= new DefinitionDisplay();
    display.build(segment, SectionType.PREDEF, getReadOnly(authentication, segment));
    return display;
  }

private boolean getReadOnly(Authentication authentication, Segment segment) {
	// TODO Auto-generated method stub
	if(segment.getUsername() ==null) {
		return true;
	}else {
		return !segment.getUsername().equals(authentication.getName());
	}
	
}


@RequestMapping(value = "/api/segments/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody DefinitionDisplay getSegmentPostdef(@PathVariable("id") String id,
      Authentication authentication) throws SegmentNotFoundException {
    Segment segment = findById(id);
    DefinitionDisplay display= new DefinitionDisplay();
    display.build(segment, SectionType.POSTDEF, getReadOnly(authentication, segment));
   
    return display;

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

//  @RequestMapping(value = "/api/segments/{id}/predef", method = RequestMethod.POST,
//      produces = {"application/json"})
//  public ResponseMessage savePredef(@PathVariable("id") String id, @RequestBody PreDef preDef,
//      Authentication authentication) throws ValidationException, SegmentNotFoundException {
//    Segment segment = segmentService.savePredef(preDef);
//    return new ResponseMessage(Status.SUCCESS, PREDEF_SAVED, id, segment.getUpdateDate());
//  }
//
//  @RequestMapping(value = "/api/segments/{id}/postdef", method = RequestMethod.POST,
//      produces = {"application/json"})
//  public ResponseMessage savePostdef(@PathVariable("id") String id, @RequestBody PostDef postDef,
//      Authentication authentication) throws ValidationException, SegmentNotFoundException {
//    Segment segment = segmentService.savePostdef(postDef);
//    return new ResponseMessage(Status.SUCCESS, POSTDEF_SAVED, id, segment.getUpdateDate());
//  }


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
  public CoConstraintTableDisplay getCoConstraints(@PathVariable("id") String id,
      Authentication authentication) throws CoConstraintNotFoundException, SegmentNotFoundException {
	  
	    CoConstraintTable table = this.coconstraintService.getCoConstraintForSegment(id);
	    
	    Segment segment = findById(id);
	    CoConstraintTableDisplay display= new CoConstraintTableDisplay();
	    display.complete(display, segment, SectionType.COCONSTRAINTS, getReadOnly(authentication, segment));
	    display.setData(table);
	    return display;
    
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

  @RequestMapping(value = "/api/segments/{id}", method = RequestMethod.POST,
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

  @RequestMapping(value = "/api/segments/{id}/preDef", method = RequestMethod.POST,
	      produces = {"application/json"})
	  @ResponseBody
	  public ResponseMessage<?> SavePreDef(@PathVariable("id") String id,
	      @RequestParam(name = "dId", required = true) String documentId, @RequestParam(name = "location", required = true) String location,
	      @RequestBody String text, Authentication authentication)
	      throws SegmentException, IOException, ValidationException {
	    try {
	      Segment s = this.segmentService.findById(id);
	      ChangeItemDomain change = new ChangeItemDomain();
	      change.setChangeType(ChangeType.UPDATE);
	      change.setLocation(id);
	      change.setPosition(-1);
		  change.setPropertyType(PropertyType.PREDEF);
		  change.setOldPropertyValue(s.getPreDef());
	    	  s.setPreDef(text);
	      change.setPropertyValue(text);
	      validateSaveOperation(s);
	     
	      EntityChangeDomain entityChangeDomain = new EntityChangeDomain();
	      entityChangeDomain.setDocumentId(documentId);
	      entityChangeDomain.setDocumentType(DocumentType.IG);
	      entityChangeDomain.setTargetId(id);
	      entityChangeDomain.setTargetType(EntityType.SEGMENT);
	      change.setChangeType(ChangeType.UPDATE);
	      change.setLocation(id);
	      change.setPosition(-1);
	      change.setPropertyType(PropertyType.PREDEF);
	      List<ChangeItemDomain> changeItems= new ArrayList<ChangeItemDomain>();
	      entityChangeDomain.setChangeItems(changeItems);
	      entityChangeDomain.setTargetVersion(s.getVersion());
	      Segment saved = segmentService.save(s);
	      entityChangeService.save(entityChangeDomain);
	      return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, saved.getId(), saved.getUpdateDate());
	    } catch (ForbiddenOperationException e) {
	      throw new SegmentException(e);
	    }
	  }

  @RequestMapping(value = "/api/segments/{id}/postDef", method = RequestMethod.POST,
	      produces = {"application/json"})
	  @ResponseBody
	  public ResponseMessage<?> savePostDef(@PathVariable("id") String id,
	      @RequestParam(name = "dId", required = true) String documentId,
	      @RequestBody String text, Authentication authentication)
	      throws SegmentException, IOException, ValidationException {
	    try {
	      Segment s = this.segmentService.findById(id);
	      ChangeItemDomain change = new ChangeItemDomain();
	      change.setChangeType(ChangeType.UPDATE);
	      change.setLocation(id);
	      change.setPosition(-1);
	 
	    	  change.setPropertyType(PropertyType.POSTDEF);
	    	  change.setOldPropertyValue(s.getPostDef());
	    	  s.setPostDef(text);
	      change.setPropertyValue(text);
	      validateSaveOperation(s);
	     
	      EntityChangeDomain entityChangeDomain = new EntityChangeDomain();
	      entityChangeDomain.setDocumentId(documentId);
	      entityChangeDomain.setDocumentType(DocumentType.IG);
	      entityChangeDomain.setTargetId(id);
	      entityChangeDomain.setTargetType(EntityType.SEGMENT);
	      change.setChangeType(ChangeType.UPDATE);
	      change.setLocation(id);
	      change.setPosition(-1);
	      change.setPropertyType(PropertyType.PREDEF);
	      List<ChangeItemDomain> changeItems= new ArrayList<ChangeItemDomain>();
	      entityChangeDomain.setChangeItems(changeItems);
	      entityChangeDomain.setTargetVersion(s.getVersion());
	      Segment saved = segmentService.save(s);
	      entityChangeService.save(entityChangeDomain);
	      return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, saved.getId(), saved.getUpdateDate());
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
