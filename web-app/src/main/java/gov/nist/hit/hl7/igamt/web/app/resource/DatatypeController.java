package gov.nist.hit.hl7.igamt.web.app.resource;

import java.io.IOException;
import java.util.*;

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
import gov.nist.hit.hl7.igamt.common.base.domain.ActiveStatus;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityType;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementDisplay;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeDisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeException;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.web.app.service.DateUpdateService;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;

@RestController
public class DatatypeController extends BaseController {

  Logger log = LoggerFactory.getLogger(DatatypeController.class);

  @Autowired
  private DatatypeService datatypeService;
  @Autowired
  private DatatypeRepository datatypeRepository;

  @Autowired
  EntityChangeService entityChangeService;

  @Autowired
  private CommonService commonService;
  @Autowired
  DateUpdateService dateUpdateService;

  private static final String STRUCTURE_SAVED = "STRUCTURE_SAVED";

  public DatatypeController() {
  }

  @RequestMapping(value = "/api/datatypes/{id}/resources", method = RequestMethod.GET, produces = {
  "application/json" })
  public Set<Resource> getResources(@PathVariable("id") String id, Authentication authentication) {
    Datatype datatype = datatypeService.findById(id);
    return datatypeService.getDependencies(datatype);
  }

  @RequestMapping(value = "/api/datatypes/{id}/{idPath}/{path}/{viewscope}/structure-by-ref", method = RequestMethod.GET, produces = {
  "application/json" })
  public Set<?> getComponentStructure(@PathVariable("id") String id, @PathVariable("idPath") String idPath,
      @PathVariable("path") String path, @PathVariable("viewscope") String viewScope,
      Authentication authentication) throws DatatypeNotFoundException {
    Datatype datatype = findById(id);
    return datatypeService.convertComponentStructure(datatype, idPath, path, viewScope);
  }

  private boolean getReadOnly(Authentication authentication, Datatype elm) {
    // TODO Auto-generated method stub
    if (elm.getUsername() == null) {
      return true;
    } else {
      return !elm.getUsername().equals(authentication.getName());
    }
  }

  @RequestMapping(value = "/api/datatypes/{id}/conformancestatement/{did}", method = RequestMethod.GET, produces = {
  "application/json" })
  public ConformanceStatementDisplay getDatatypeConformanceStatement(@PathVariable("id") String id,
      @PathVariable("did") String did, Authentication authentication) throws DatatypeNotFoundException {
    Datatype datatype = findById(id);

    ConformanceStatementDisplay conformanceStatementDisplay = new ConformanceStatementDisplay();
    Set<ConformanceStatement> cfs = new HashSet<ConformanceStatement>();
    if (datatype.getBinding() != null && datatype.getBinding().getConformanceStatements() != null) {
      for (ConformanceStatement cs : datatype.getBinding().getConformanceStatements()) {
        cfs.add(cs);
      }
      conformanceStatementDisplay.setChangeReason(datatype.getBinding().getConformanceStatementsChangeLog());
    }
    HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap = new HashMap<String, ConformanceStatementsContainer>();
    this.datatypeService.collectAssoicatedConformanceStatements(datatype, associatedConformanceStatementMap);
    conformanceStatementDisplay.complete(datatype, SectionType.CONFORMANCESTATEMENTS,
        getReadOnly(authentication, datatype), cfs, null, associatedConformanceStatementMap);
    conformanceStatementDisplay.setType(Type.DATATYPE);
    return conformanceStatementDisplay;
  }

  @RequestMapping(value = "/api/datatypes/{scope}/{version:.+}", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<List<Datatype>> findHl7Datatypes(@PathVariable String version,
      @PathVariable String scope, Authentication authentication) {
    List<Datatype> ret = new ArrayList<>();
    if(scope.equals(Scope.SDTF.toString())) {
      ret = this.datatypeRepository.findByDomainInfoCompatibilityVersionContainsAndDomainInfoScopeAndActiveInfoStatus(version, Scope.SDTF, ActiveStatus.ACTIVE);
    } else {
      ret =  datatypeService.findDisplayFormatByScopeAndVersion(scope, version);
    }
    return new ResponseMessage<List<Datatype>>(Status.SUCCESS, "", "", null, false, null,
        ret);

  }

  private Datatype findById(String id) throws DatatypeNotFoundException {
    Datatype Datatype = datatypeService.findById(id);
    if (Datatype == null) {
      throw new DatatypeNotFoundException(id);
    }
    return Datatype;
  }

  @RequestMapping(value = "/api/datatypes/{id}", method = RequestMethod.GET, produces = {"application/json"})
  public Datatype getSegment(
      @PathVariable("id") String id,
      Authentication authentication) throws DatatypeNotFoundException {
    return this.findById(id);
  }

  @RequestMapping(value = "/api/datatypes/{id}", method = RequestMethod.POST, produces = { "application/json" })
  @ResponseBody
  public ResponseMessage<?> applyChanges(@PathVariable("id") String id,
      @RequestParam(name = "dId", required = true) String documentId, @RequestParam(name = "type", required = true) DocumentType documentType, @RequestBody List<ChangeItemDomain> cItems,
      Authentication authentication) throws DatatypeException, IOException, ForbiddenOperationException, ApplyChangeException {
    Datatype dt = this.datatypeService.findById(id);
    validateSaveOperation(dt);
    commonService.checkRight(authentication, dt.getCurrentAuthor(), dt.getUsername());
    this.datatypeService.applyChanges(dt, cItems, documentId);
	dateUpdateService.updateDate(new DocumentInfo(documentId, documentType));

    return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, dt.getId(), new Date());
  }

  private void validateSaveOperation(Datatype dt) throws ForbiddenOperationException {
    if (Scope.HL7STANDARD.equals(dt.getDomainInfo().getScope())) {
      throw new ForbiddenOperationException("FORBIDDEN_SAVE_SEGMENT");
    }
  }

}
