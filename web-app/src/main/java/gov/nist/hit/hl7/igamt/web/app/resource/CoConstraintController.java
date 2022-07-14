package gov.nist.hit.hl7.igamt.web.app.resource;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.exception.CoConstraintNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@RestController
public class CoConstraintController extends BaseController {

    @Autowired
    CoConstraintService ccService;

    @RequestMapping(value = "/api/coconstraints/group/{id}", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('COCONSTRAINTGROUP', #id, READ)")
    public CoConstraintGroup getCoConstraintGroup(@PathVariable("id") String id,
                                                  Authentication authentication) throws EntityNotFound {
        CoConstraintGroup group = ccService.findById(id);
        return group;
    }

    @RequestMapping(value = "/api/coconstraints/group", method = RequestMethod.POST, produces = {"application/json" })
    @PreAuthorize("AccessResource('COCONSTRAINTGROUP', #group.id, WRITE)")
    public ResponseMessage getCoConstraintGroup(@RequestBody CoConstraintGroup group,
                                                Authentication authentication) throws CoConstraintNotFoundException {
        CoConstraintGroup gp = this.ccService.saveCoConstraintGroup(group);
        return new ResponseMessage(ResponseMessage.Status.SUCCESS, STRUCTURE_SAVED, gp.getId(), new Date());
    }

    @RequestMapping(value = "/api/coconstraints/group/{id}/resources", method = RequestMethod.GET, produces = {
            "application/json" })
    @PreAuthorize("AccessResource('COCONSTRAINTGROUP', #id, READ)")
    public Set<Resource> getResources(@PathVariable("id") String id, Authentication authentication) throws EntityNotFound {
        CoConstraintGroup group = ccService.findById(id);
        Set<Resource> resources = new HashSet<>();
        resources.add(group);
        return resources;
    }

}