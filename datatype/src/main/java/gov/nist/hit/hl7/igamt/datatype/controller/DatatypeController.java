package gov.nist.hit.hl7.igamt.datatype.controller;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
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
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
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
import gov.nist.hit.hl7.igamt.common.config.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.display.ConformanceStatementDisplay;
import gov.nist.hit.hl7.igamt.constraints.domain.display.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeDisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeException;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;

@RestController
public class DatatypeController extends BaseController {


  Logger log = LoggerFactory.getLogger(DatatypeController.class);

  @Autowired
  private DatatypeService datatypeService;

  @Autowired
  EntityChangeService entityChangeService;

  @Autowired
  private CommonService commonService;
  
  @Autowired
  private ConformanceStatementRepository conformanceStatementRepository;

  private static final String STRUCTURE_SAVED = "STRUCTURE_SAVED";
  private static final String PREDEF_SAVED = "PREDEF_SAVED";
  private static final String POSTDEF_SAVED = "POSTDEF_SAVED";
  private static final String METADATA_SAVED = "METADATA_SAVED";
  private static final String CONFORMANCESTATEMENT_SAVED = "CONFORMANCESTATEMENT_SAVED";


  public DatatypeController() {}

  @RequestMapping(value = "/api/datatypes/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})
  public DatatypeStructureDisplay getDatatypeStructure(@PathVariable("id") String id,
      Authentication authentication) throws DatatypeNotFoundException {
    Datatype datatype = findById(id);
    return datatypeService.convertDomainToStructureDisplay(datatype, getReadOnly(authentication, datatype));

  }

  @RequestMapping(value = "/api/datatypes/{id}/{idPath}/{path}/{viewscope}/structure-by-ref",
      method = RequestMethod.GET, produces = {"application/json"})
  public Set<?> getComponentStructure(@PathVariable("id") String id,
      @PathVariable("idPath") String idPath, @PathVariable("path") String path,
      @PathVariable("viewscope") String viewScope, Authentication authentication)
      throws DatatypeNotFoundException {
    Datatype datatype = findById(id);
    return datatypeService.convertComponentStructure(datatype, idPath, path, viewScope);
  }

  @RequestMapping(value = "/api/datatypes/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})
  public DatatypeDisplayMetadata getDatatypeMetadata(@PathVariable("id") String id,
      Authentication authentication) throws DatatypeNotFoundException {
    Datatype datatype = findById(id);
    DatatypeDisplayMetadata display= new DatatypeDisplayMetadata();
    display.complete(datatype, SectionType.METADATA, getReadOnly(authentication, datatype));
    return display;
  }

  @RequestMapping(value = "/api/datatypes/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public DefinitionDisplay getDatatypePredef(@PathVariable("id") String id, Authentication authentication)
      throws DatatypeNotFoundException {
	  
	  
    Datatype datatype = findById(id);
    DefinitionDisplay display= new DefinitionDisplay();
    display.build(datatype, SectionType.PREDEF, getReadOnly(authentication, datatype));
    return display;
}
 
  private boolean getReadOnly(Authentication authentication, Datatype elm) {
	// TODO Auto-generated method stub
	if(elm.getUsername() ==null) {
		return true;
	}else {
		return !elm.getUsername().equals(authentication.getName());
	}
	
}
 
  @RequestMapping(value = "/api/datatypes/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public DefinitionDisplay getDatatypePostdef(@PathVariable("id") String id, Authentication authentication)
      throws DatatypeNotFoundException {
	   Datatype datatype = findById(id);
	    DefinitionDisplay display= new DefinitionDisplay();
	    display.build(datatype, SectionType.POSTDEF, getReadOnly(authentication, datatype));
	    return display;

  }

  @RequestMapping(value = "/api/datatypes/{id}/conformancestatement/{did}", method = RequestMethod.GET,
      produces = {"application/json"})
  public ConformanceStatementDisplay getDatatypeConformanceStatement(@PathVariable("id") String id, @PathVariable("did") String did,
      Authentication authentication) throws DatatypeNotFoundException {
    Datatype datatype = findById(id);
    
    ConformanceStatementDisplay conformanceStatementDisplay= new ConformanceStatementDisplay();
    Set<ConformanceStatement> cfs = new HashSet<ConformanceStatement>();
    if(datatype.getBinding() != null && datatype.getBinding().getConformanceStatementIds() != null) {
    	for(String csId : datatype.getBinding().getConformanceStatementIds()){
    	  Optional<ConformanceStatement> cs = conformanceStatementRepository.findById(csId);
    	  if(cs.isPresent()) cfs.add(cs.get());
    	}
    }
    
    Set<ConformanceStatement> acs = this.datatypeService.collectAvaliableConformanceStatements(did, datatype.getId(), datatype.getName());
    
    HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap = new HashMap<String, ConformanceStatementsContainer>();
    this.datatypeService.collectAssoicatedConformanceStatements(datatype, associatedConformanceStatementMap);
    conformanceStatementDisplay.complete(datatype, SectionType.CONFORMANCESTATEMENTS, getReadOnly(authentication, datatype), cfs, acs, associatedConformanceStatementMap);
    conformanceStatementDisplay.setType(Type.DATATYPE);
    return  conformanceStatementDisplay;
  }



  @RequestMapping(value = "/api/datatypes/hl7/{version:.+}", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody List<Datatype> findHl7Datatypes(@PathVariable String version,
      Authentication authentication) {
    return datatypeService.findDisplayFormatByScopeAndVersion(Scope.HL7STANDARD.toString(),
        version);
  }


  private Datatype findById(String id) throws DatatypeNotFoundException {
    Datatype Datatype = datatypeService.findById(id);
    if (Datatype == null) {
      throw new DatatypeNotFoundException(id);
    }
    return Datatype;
  }


  @RequestMapping(value = "/api/datatypes/{id}", method = RequestMethod.POST,
      produces = {"application/json"})
  @ResponseBody
  public ResponseMessage<?> applyChanges(@PathVariable("id") String id,
      @RequestParam(name = "dId", required = true) String documentId,
      @RequestBody List<ChangeItemDomain> cItems, Authentication authentication)
      throws DatatypeException, IOException, ForbiddenOperationException {
    Datatype dt = this.datatypeService.findById(id);
    validateSaveOperation(dt);
    this.datatypeService.applyChanges(dt, cItems, documentId);
    EntityChangeDomain entityChangeDomain = new EntityChangeDomain();
    entityChangeDomain.setDocumentId(documentId);
    entityChangeDomain.setDocumentType(DocumentType.IG);
    entityChangeDomain.setTargetId(id);
    entityChangeDomain.setTargetType(EntityType.DATATYPE);
    entityChangeDomain.setChangeItems(cItems);
    entityChangeDomain.setTargetVersion(dt.getVersion());
    entityChangeService.save(entityChangeDomain);
    return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, dt.getId(), new Date());
  }

  private void validateSaveOperation(Datatype dt) throws ForbiddenOperationException {
    if (Scope.HL7STANDARD.equals(dt.getDomainInfo().getScope())) {
      throw new ForbiddenOperationException("FORBIDDEN_SAVE_SEGMENT");
    }
  }


}
