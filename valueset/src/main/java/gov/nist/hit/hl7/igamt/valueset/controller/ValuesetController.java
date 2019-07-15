package gov.nist.hit.hl7.igamt.valueset.controller;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetMetadata;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetPostDef;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetPreDef;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@RestController
public class ValuesetController extends BaseController {

	Logger log = LoggerFactory.getLogger(ValuesetController.class);

	@Autowired
	ValuesetService valuesetService;

	private static final String STRUCTURE_SAVED = "STRUCTURE_SAVED";
	private static final String PREDEF_SAVED = "PREDEF_SAVED";
	private static final String POSTDEF_SAVED = "POSTDEF_SAVED";
	private static final String METADATA_SAVED = "METADATA_SAVED";

	public ValuesetController() {
	}

	@RequestMapping(value = "/api/valuesets/{scope}/{version:.+}", method = RequestMethod.GET, produces = {
			"application/json" })
	public @ResponseBody ResponseMessage<List<Valueset>> findHl7ValueSets(@PathVariable String version,
			@PathVariable String scope, Authentication authentication) {
		return new ResponseMessage<List<Valueset>>(Status.SUCCESS, "", "", null, false, null,
				valuesetService.findDisplayFormatByScopeAndVersion(scope, version));
	}

	@RequestMapping(value = "/api/valuesets/{id}/resources", method = RequestMethod.GET, produces = {
			"application/json" })

	public Set<Resource> getResources(@PathVariable("id") String id, Authentication authentication) {
		Valueset valueset = valuesetService.findById(id);
		Set<Resource> resources = new HashSet<Resource>();
		resources.add(valueset);
		return resources;
	}
	

	@RequestMapping(value = "/api/valuesets/{id}", method = RequestMethod.GET, produces = {
			"application/json" })

	public Valueset getValueSet(@PathVariable("id") String id, Authentication authentication) {
		Valueset valueset = valuesetService.findById(id);
		return valueset;
	}
	
	private Valueset findById(String id) throws ValuesetNotFoundException {
		Valueset valueset = valuesetService.findById(id);
		if (valueset == null) {
			throw new ValuesetNotFoundException(id);
		}
		return valueset;
	}

}
