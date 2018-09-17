package gov.nist.hit.hl7.igamt.coconstraints.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintSaveException;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import javassist.NotFoundException;

@RestController
public class CoConstraintController {
	
	@Autowired
	CoConstraintService coconstraintService;

	@RequestMapping(value = "/api/segments/{id}/coconstraints", method = RequestMethod.GET, produces = {"application/json" })
	@ResponseBody
	public CoConstraintTable getCoConstraints(@PathVariable("id") String id, Authentication authentication) throws NotFoundException {
		return this.coconstraintService.getLatestCoConstraintForSegment(id);
	}
	
	@RequestMapping(value = "/api/segments/{id}/coconstraints", method = RequestMethod.POST, produces = {"application/json" })
	@ResponseBody
	public CoConstraintTable saveCoConstraints(@PathVariable("id") String id, @RequestBody CoConstraintTable table, Authentication authentication) throws CoConstraintSaveException {
		return this.coconstraintService.saveCoConstraintForSegment(id, table, authentication.getPrincipal().toString());
	}

}
