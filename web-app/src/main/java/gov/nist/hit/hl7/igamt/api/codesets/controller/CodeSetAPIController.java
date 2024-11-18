package gov.nist.hit.hl7.igamt.api.codesets.controller;

import gov.nist.hit.hl7.igamt.access.security.APIAccessControlService;
import gov.nist.hit.hl7.igamt.api.codesets.exception.ResourceAPIException;
import gov.nist.hit.hl7.igamt.access.exception.ResourceNotFoundAPIException;
import gov.nist.hit.hl7.igamt.api.codesets.model.*;
import gov.nist.hit.hl7.igamt.api.codesets.service.impl.CodeSetAPIService;
import gov.nist.hit.hl7.igamt.api.codesets.service.impl.SimpleCodeSetAPIService;
import gov.nist.hit.hl7.igamt.api.security.domain.AccessKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class CodeSetAPIController {

	@Autowired
	SimpleCodeSetAPIService codeSetAPIService;
	@Autowired
	APIAccessControlService apiAccessControlService;

	@GetMapping(path="/codesets")
	@ResponseBody
	public ResponseArray<CodeSetInfo> getCodeSets() throws ResourceAPIException {
		try {
			AccessKey accessKey = apiAccessControlService.getAccessKey();
			ResponseArray<CodeSetInfo> response = new ResponseArray<>();
			response.setList(codeSetAPIService.getAllUserAccessCodeSet(accessKey));
			return response;
		} catch(Exception exception) {
			throw new ResourceAPIException("There has been an unexpected error while trying to retrieve code sets");
		}
	}

	@GetMapping(path="/codesets/{id}/metadata")
	@ResponseBody
	@PreAuthorize("APIAccess('CODESET', #id, READ)")
	public CodeSetMetadata getCodeSetById(@PathVariable String id) throws ResourceAPIException, ResourceNotFoundAPIException {
		try {
			return codeSetAPIService.getCodeSetMetadata(id);
		}  catch(ResourceNotFoundAPIException exception) {
			throw exception;
		} catch(Exception exception) {
			throw new ResourceAPIException("There has been an unexpected error while trying to retrieve code set");
		}
	}

	@GetMapping(path="/codesets/{id}")
	@ResponseBody
	@PreAuthorize("APIAccess('CODESET', #id, READ)")
	public CodeSetQueryResult getCodeSetCodesByQuery(
			@PathVariable("id") String id,
			@RequestParam(name = "version", required = false) String version,
			@RequestParam(name = "match", required = false) String match
	) throws ResourceAPIException, ResourceNotFoundAPIException {
		try {
			return codeSetAPIService.getCodeSetByQuery(id, version, match);
		} catch(ResourceNotFoundAPIException exception) {
			throw exception;
		} catch(Exception exception) {
			throw new ResourceAPIException("There has been an unexpected error while trying to retrieve codes");
		}
	}
}
