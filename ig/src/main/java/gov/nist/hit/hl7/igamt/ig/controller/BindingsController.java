package gov.nist.hit.hl7.igamt.ig.controller;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.binding.FlatResourceBinding;
import gov.nist.hit.hl7.igamt.ig.binding.FlatResourceBindingDisplay;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingVerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class BindingsController extends BaseController {

    @Autowired
    ResourceBindingVerificationService verificationService;
    @Autowired
    ResourceBindingService resourceBindingService;
    @Autowired
    DatatypeService datatypeService;
    @Autowired
    SegmentService segmentService;
    @Autowired
    ConformanceProfileService conformanceProfileService;

    @RequestMapping(value = "/api/bindings/{type}/{id}", method = RequestMethod.GET, produces = {
            "application/json" })
    public @ResponseBody
    FlatResourceBindingDisplay getBindingsSummary(
            @PathVariable("id") String id,
            @PathVariable("type") Type type,
            Authentication authentication) throws Exception {
        switch (type) {
            case DATATYPE:
                Datatype datatype = this.datatypeService.findById(id);
                if(datatype == null) {
                    throw new ResourceNotFoundException(id, type);
                } else {
                    return this.resourceBindingService.getFlatResourceBindingsDisplay(
                            datatype,
                            this.resourceBindingService.getFlatResourceBindings(datatype.getBinding())
                    );
                }
            case SEGMENT:
                Segment segment = this.segmentService.findById(id);
                if(segment == null) {
                    throw new ResourceNotFoundException(id, type);
                } else {
                    return this.resourceBindingService.getFlatResourceBindingsDisplay(
                            segment,
                            this.resourceBindingService.getFlatResourceBindings(segment.getBinding())
                    );                }
            case CONFORMANCEPROFILE:
                ConformanceProfile conformanceProfile = this.conformanceProfileService.findById(id);
                if(conformanceProfile == null) {
                    throw new ResourceNotFoundException(id, type);
                } else {
                    return this.resourceBindingService.getFlatResourceBindingsDisplay(
                            conformanceProfile,
                            this.resourceBindingService.getFlatResourceBindings(conformanceProfile.getBinding())
                    );                }
            default:
                throw new Exception("Type " + type + " does not have bindings");
        }
    }

    @RequestMapping(value = "/api/bindings/{type}/{id}/verify", method = RequestMethod.GET, produces = {
            "application/json" })
    public @ResponseBody
    List<IgamtObjectError> verifyBindings(
            @PathVariable("id") String id,
            @PathVariable("type") Type type,
            Authentication authentication) throws Exception {
        switch (type) {
            case DATATYPE:
                Datatype datatype = this.datatypeService.findById(id);
                if(datatype == null) {
                    throw new ResourceNotFoundException(id, type);
                } else {
                    return this.verificationService.verifyDatatypeBindings(datatype);
                }
            case SEGMENT:
                Segment segment = this.segmentService.findById(id);
                if(segment == null) {
                    throw new ResourceNotFoundException(id, type);
                } else {
                    return this.verificationService.verifySegmentBindings(segment);
                }
            case CONFORMANCEPROFILE:
                ConformanceProfile conformanceProfile = this.conformanceProfileService.findById(id);
                if(conformanceProfile == null) {
                    throw new ResourceNotFoundException(id, type);
                } else {
                    return this.verificationService.verifyConformanceProfileBindings(conformanceProfile);
                }
            default:
                throw new Exception("Type " + type + " does not have bindings");
        }
    }
}
