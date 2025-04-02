package gov.nist.hit.hl7.igamt.api.security.controller;

import gov.nist.hit.hl7.igamt.api.security.model.APIKeyCreateRequest;
import gov.nist.hit.hl7.igamt.api.security.model.AccessKeyDisplay;
import gov.nist.hit.hl7.igamt.api.security.model.GeneratedAccessKey;
import gov.nist.hit.hl7.igamt.api.security.service.AccessKeyService;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class APIKeyController {

	@Autowired
	private AccessKeyService accessKeyService;

	@GetMapping("/api/access-keys")
	@ResponseBody
	public List<AccessKeyDisplay> getAPIKeys(
			@AuthenticationPrincipal Principal principal
	) {
		return this.accessKeyService.getUserAccessKeys(
				principal.getName()
		);
	}

	@PostMapping("/api/access-keys/create")
	@ResponseBody
	public GeneratedAccessKey createAPIKey(
			@RequestBody APIKeyCreateRequest createRequest,
			@AuthenticationPrincipal Principal principal
	) throws Exception {
		return this.accessKeyService.createAccessKey(
			principal.getName(),
			createRequest.getName(),
			createRequest.getResources(),
			createRequest.isExpires(),
			createRequest.getValidityDays()
		);
	}

	@DeleteMapping("/api/access-keys/{id}")
	@ResponseBody
	public ResponseMessage<Void> delete(
			@PathVariable String id
	) throws Exception {
		this.accessKeyService.deleteAccessKey(id);
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "API Key successfully deleted");
	}
}
