package gov.nist.hit.hl7.igamt.api.codesets.controller;

import gov.nist.hit.hl7.igamt.access.exception.ResourceAPIException;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetInfo;
import gov.nist.hit.hl7.igamt.api.codesets.model.Code;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetMetadata;
import gov.nist.hit.hl7.igamt.api.codesets.model.ResponseArray;
import gov.nist.hit.hl7.igamt.api.codesets.service.CodeSetAPIService;
import gov.nist.hit.hl7.igamt.api.security.domain.KeyAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class CodeSetAPIController {

	@Autowired
	CodeSetAPIService codeSetAPIService;

	@GetMapping(path="/codesets")
	@ResponseBody
	public ResponseArray<CodeSetInfo> getCodeSets(KeyAuthenticationToken keyAuthenticationToken) throws ResourceAPIException {
		try {
			ResponseArray<CodeSetInfo> response = new ResponseArray<>();
			response.setList(codeSetAPIService.getAllUserAccessCodeSet(keyAuthenticationToken.getName()));
			return response;
		} catch(Exception exception) {
			throw new ResourceAPIException("There has been an unexpected error while trying to retrieve code sets");
		}
	}

	@GetMapping(path="/codesets/{id}")
	@ResponseBody
	@PreAuthorize("APIAccess('CODESET', #id, READ)")
	public CodeSetMetadata getCodeSetById(@PathVariable String id) throws ResourceAPIException {
		try {
			return codeSetAPIService.getCodeSetMetadata(id);
		} catch(Exception exception) {
			throw new ResourceAPIException("There has been an unexpected error while trying to retrieve code set");
		}
	}

	@GetMapping(path="/codesets/{id}/codes")
	@ResponseBody
	@PreAuthorize("APIAccess('CODESET', #id, READ)")
	public ResponseArray<Code> getCodeSetCodesByQuery(
			@PathVariable("id") String id,
			@RequestParam(name = "version", required = false) String version,
			@RequestParam(name = "match", required = false) String match
	) throws ResourceAPIException {
		try {
			ResponseArray<Code> response = new ResponseArray<>();
			response.setList(codeSetAPIService.getCodeMatches(id, version, match));
			return response;
		} catch(Exception exception) {
			throw new ResourceAPIException("There has been an unexpected error while trying to retrieve codes");
		}
	}

}
