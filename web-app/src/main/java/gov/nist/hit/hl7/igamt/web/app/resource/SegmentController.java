package gov.nist.hit.hl7.igamt.web.app.resource;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
import gov.nist.hit.hl7.igamt.ig.domain.verification.DTSegVerificationResult;
import gov.nist.hit.hl7.igamt.ig.service.VerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.web.app.service.DateUpdateService;

@RestController
public class SegmentController extends BaseController {

	Logger log = LoggerFactory.getLogger(SegmentController.class);

	@Autowired
	SegmentService segmentService;
	
	@Autowired
	CommonService commonService;
	
	@Autowired
	EntityChangeService entityChangeService;
	
	@Autowired
	DateUpdateService dateUpdateService;
	
	@Autowired
	VerificationService verificationService;

	public SegmentController() {
	}

	@RequestMapping(value = "/api/segments/{id}/resources", method = RequestMethod.GET, produces = {
			"application/json" })
	@PreAuthorize("AccessResource('SEGMENT', #id, READ)")
	public Set<Resource> getResources(@PathVariable("id") String id, Authentication authentication) {
		Segment segment = segmentService.findById(id);
		return segmentService.getDependencies(segment);
	}

	@RequestMapping(value = "/api/segments/{id}/{idPath}/{path}/structure-by-ref", method = RequestMethod.GET, produces = {
			"application/json" })
	@PreAuthorize("AccessResource('SEGMENT', #id, READ)")
	public Set<?> getComponentStructure(@PathVariable("id") String id, @PathVariable("idPath") String idPath,
			@PathVariable("path") String path, Authentication authentication) throws SegmentNotFoundException {
		Segment segment = findById(id);
		return segmentService.convertSegmentStructurForMessage(segment, idPath, path);
	}

	@RequestMapping(value = "/api/segments/{id}/conformancestatement/{did}", method = RequestMethod.GET, produces = {
			"application/json" })
	@PreAuthorize("AccessResource('SEGMENT', #id, READ)")
	public ConformanceStatementDisplay getSegmentConformanceStatement(@PathVariable("id") String id,
			@PathVariable("did") String did, Authentication authentication) throws SegmentNotFoundException {
		Segment segment = findById(id);

		ConformanceStatementDisplay conformanceStatementDisplay = new ConformanceStatementDisplay();
		Set<ConformanceStatement> cfs = new HashSet<ConformanceStatement>();
		if (segment.getBinding() != null && segment.getBinding().getConformanceStatements() != null) {
			for (ConformanceStatement cs : segment.getBinding().getConformanceStatements()) {
				cfs.add(cs);
			}
			conformanceStatementDisplay.setChangeReason(segment.getBinding().getConformanceStatementsChangeLog());
		}
		HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap = new HashMap<String, ConformanceStatementsContainer>();
		this.segmentService.collectAssoicatedConformanceStatements(segment, associatedConformanceStatementMap);
		conformanceStatementDisplay.complete(segment, SectionType.CONFORMANCESTATEMENTS,
				getReadOnly(authentication, segment), cfs, null, associatedConformanceStatementMap);
		conformanceStatementDisplay.setType(Type.SEGMENT);
		return conformanceStatementDisplay;
	}

	private boolean getReadOnly(Authentication authentication, Segment segment) {
		// TODO Auto-generated method stub
		if (segment.getUsername() == null) {
			return true;
		} else {
			return !segment.getUsername().equals(authentication.getName());
		}
	}

	@RequestMapping(value = "/api/segments/{scope}/{version:.+}", method = RequestMethod.GET, produces = {
			"application/json" })
	public @ResponseBody ResponseMessage<List<Segment>> find(@PathVariable String version, @PathVariable Scope scope,
			Authentication authentication) {

		return new ResponseMessage<List<Segment>>(Status.SUCCESS, "", "", null, false, null,
				segmentService.findDisplayFormatByScopeAndVersion(scope, version, authentication.getName()));
	}

	private Segment findById(String id) throws SegmentNotFoundException {
		Segment segment = segmentService.findById(id);
		if (segment == null) {
			throw new SegmentNotFoundException(id);
		}
		return segment;
	}

	@RequestMapping(value = "/api/segments/{id}", method = RequestMethod.GET, produces = {"application/json"})
	@PreAuthorize("AccessResource('SEGMENT', #id, READ)")
	public Segment getSegment(
			@PathVariable("id") String id,
			Authentication authentication) throws SegmentNotFoundException {
		return this.findById(id);
	}

	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/api/segments/{id}", method = RequestMethod.POST, produces = { "application/json" })
	@PreAuthorize("AccessResource('SEGMENT', #id, WRITE) && ConcurrentSync('SEGMENT', #id, ALLOW_SYNC_STRICT)")
	@ResponseBody
	public ResponseMessage<?> applyStructureChanges(@PathVariable("id") String id, @RequestBody List<ChangeItemDomain> cItems,
			Authentication authentication) throws Exception {
		try {
			Segment s = this.segmentService.findById(id);
			this.segmentService.applyChanges(s, cItems);
			this.dateUpdateService.updateDate(s.getDocumentInfo());
			return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, s.getId(), new Date());
		} catch (ForbiddenOperationException e) {
			throw new SegmentException(e);
		}
	}
	
	@RequestMapping(value = "/api/segments/{id}/verification", method = RequestMethod.GET, produces = {
			"application/json" })
	@PreAuthorize("AccessResource('SEGMENT', #id, READ)")
	public @ResponseBody DTSegVerificationResult verifyById(@PathVariable("id") String id,
			Authentication authentication) {
		Segment seg = this.segmentService.findById(id);
		if (seg != null) {
			DTSegVerificationResult report = this.verificationService.verifySegment(seg);
			return report;
		}
		return null;
	}

}
