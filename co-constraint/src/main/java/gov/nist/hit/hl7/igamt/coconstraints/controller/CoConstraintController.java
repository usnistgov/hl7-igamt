package gov.nist.hit.hl7.igamt.coconstraints.controller;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.segment.exception.CoConstraintNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
public class CoConstraintController extends BaseController {

    @Autowired
    CoConstraintService ccService;

    @RequestMapping(value = "/api/coconstraints/group/{id}", method = RequestMethod.GET, produces = {
            "application/json" })
    public CoConstraintGroup getCoConstraintGroup(@PathVariable("id") String id,
                                                  Authentication authentication) throws CoConstraintGroupNotFoundException {
        CoConstraintGroup group = ccService.findById(id);
        return group;
    }

    @RequestMapping(value = "/api/coconstraints/group", method = RequestMethod.POST, produces = {
            "application/json" })
    public ResponseMessage getCoConstraintGroup(@RequestBody CoConstraintGroup group,
                                                Authentication authentication) throws CoConstraintNotFoundException {
        CoConstraintGroup gp = this.ccService.saveCoConstraintGroup(group);
        return new ResponseMessage(ResponseMessage.Status.SUCCESS, STRUCTURE_SAVED, gp.getId(), new Date());
    }


}