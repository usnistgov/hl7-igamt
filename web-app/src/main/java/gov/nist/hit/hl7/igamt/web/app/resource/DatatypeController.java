package gov.nist.hit.hl7.igamt.web.app.resource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.access.active.NotifySave;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import gov.nist.hit.hl7.igamt.common.base.domain.ActiveStatus;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementDisplay;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeException;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.verification.DTSegVerificationResult;
import gov.nist.hit.hl7.igamt.ig.service.VerificationService;
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
	
	@Autowired
	VerificationService verificationService;

	private static final String STRUCTURE_SAVED = "STRUCTURE_SAVED";

	public DatatypeController() {
	}

	@RequestMapping(value = "/api/datatypes/{id}/resources", method = RequestMethod.GET, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('DATATYPE', #id, READ)")
	public Set<Resource> getResources(@PathVariable("id") String id, Authentication authentication) {
		Datatype datatype = datatypeService.findById(id);
		return datatypeService.getDependencies(datatype);
	}

	@RequestMapping(value = "/api/datatypes/{id}/{idPath}/{path}/{viewscope}/structure-by-ref", method = RequestMethod.GET, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('DATATYPE', #id, READ)")
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
	@PreAuthorize("AccessResource('DATATYPE', #id, READ)")
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
	@PreAuthorize("AccessResource('DATATYPE', #id, READ)")
	public Datatype getSegment(
			@PathVariable("id") String id,
			Authentication authentication) throws DatatypeNotFoundException {
		return this.findById(id);
	}

	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/api/datatypes/{id}", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	@NotifySave(id = "#id", type = "'DATATYPE'")
	@PreAuthorize("AccessResource('DATATYPE', #id, WRITE) && ConcurrentSync('DATATYPE', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<?> applyChanges(@PathVariable("id") String id,
			@RequestBody List<ChangeItemDomain> cItems,
			Authentication authentication) throws DatatypeException, IOException, ForbiddenOperationException, ApplyChangeException {
		Datatype dt = this.datatypeService.findById(id);
		this.datatypeService.applyChanges(dt, cItems);
		dateUpdateService.updateDate(dt.getDocumentInfo());
		return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, dt.getId(), dt.getUpdateDate());
	}
	
	@RequestMapping(value = "/api/datatypes/{id}/verification", method = RequestMethod.GET, produces = {
			"application/json" })
	@PreAuthorize("AccessResource('DATATYPE', #id, READ)")
	public @ResponseBody DTSegVerificationResult verifyById(@PathVariable("id") String id,
			Authentication authentication) {
		Datatype dt = this.datatypeService.findById(id);
		if (dt != null) {
			DTSegVerificationResult report = this.verificationService.verifyDatatype(dt);
			return report;
		}
		return null;
	}

}
