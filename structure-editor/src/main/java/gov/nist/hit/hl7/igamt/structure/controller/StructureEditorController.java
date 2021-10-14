package gov.nist.hit.hl7.igamt.structure.controller;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.structure.domain.*;
import gov.nist.hit.hl7.igamt.structure.service.impl.StructureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Set;


@RestController()
public class StructureEditorController {

    @Autowired
    StructureService structureService;

    @RequestMapping(value = "api/structure-editor/structures", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    CustomStructureRegistry registry(Authentication authentication) {
        return structureService.getCustomStructureRegistry(authentication.getName());
    }

    @RequestMapping(value = "api/structure-editor/structure", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    MessageStructureAndDisplay createStructure(@RequestBody MessageStructureCreateWrapper request, Authentication authentication) {
        return structureService.createMessageStructure(request, authentication.getName());
    }

    @RequestMapping(value = "api/structure-editor/segment", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    SegmentStructureAndDisplay createSegment(@RequestBody SegmentStructureCreateWrapper request, Authentication authentication) {
        return structureService.createSegmentStructure(request, authentication.getName());
    }

    @RequestMapping(value = "api/structure-editor/structure/{id}/save", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<Object> saveStructure(@PathVariable("id") String id, @RequestBody Set<SegmentRefOrGroup> children, Authentication authentication) throws InvalidStructureException {
        MessageStructure ms = structureService.saveMessageStructure(id, authentication.getName(), children);
        return new ResponseMessage<Object>(ResponseMessage.Status.SUCCESS, "MESSAGE STRUCTURE SAVED", ms.getId(), new Date());
    }

    @RequestMapping(value = "api/structure-editor/structure/{id}/metadata/save", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<Object> saveMetadata(@PathVariable("id") String id, @RequestBody MessageStructureMetadata metadata, Authentication authentication) {
        MessageStructure ms = structureService.saveMessageMetadata(id, authentication.getName(), metadata);
        return new ResponseMessage<Object>(ResponseMessage.Status.SUCCESS, "MESSAGE METADATA SAVED", ms.getId(), new Date());
    }

    @RequestMapping(value = "api/structure-editor/segment/{id}/save", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<Object> saveSegment(@PathVariable("id") String id, @RequestBody Set<Field> children, Authentication authentication) {
        Segment ms = structureService.saveSegment(id, authentication.getName(), children);
        return new ResponseMessage<Object>(ResponseMessage.Status.SUCCESS, "SEGMENT STRUCTURE SAVED", ms.getId(), new Date());
    }

    @RequestMapping(value = "api/structure-editor/segment/{id}/metadata/save", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<Object> saveSegmentMetadata(@PathVariable("id") String id, @RequestBody SegmentStructureMetadata metadata, Authentication authentication) {
        Segment ms = structureService.saveSegmentMetadata(id, authentication.getName(), metadata);
        return new ResponseMessage<Object>(ResponseMessage.Status.SUCCESS, "SEGMENT METADATA SAVED", ms.getId(), new Date());
    }

    @RequestMapping(value = "api/structure-editor/segment/{id}/publish", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<SegmentStructureAndDisplay> publishSegment(@PathVariable("id") String id, Authentication authentication) {
        SegmentStructureAndDisplay ms = structureService.publishSegment(id, authentication.getName());
        return new ResponseMessage<SegmentStructureAndDisplay>(ResponseMessage.Status.SUCCESS, "SEGMENT STRUCTURE PUBLISHED", ms.getDisplayElement().getId(), ms, new Date());
    }

    @RequestMapping(value = "api/structure-editor/structure/{id}/publish", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<MessageStructureAndDisplay> publishMessage(@PathVariable("id") String id, Authentication authentication) {
        MessageStructureAndDisplay ms = structureService.publishMessageStructure(id, authentication.getName());
        return new ResponseMessage<MessageStructureAndDisplay>(ResponseMessage.Status.SUCCESS, "MESSAGE STRUCTURE PUBLISHED", ms.getDisplayElement().getId(), ms, new Date());
    }

    @RequestMapping(value = "api/structure-editor/structures/{id}", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    MessageStructure structure(@PathVariable("id") String id, Authentication authentication) {
        MessageStructure messageStructure = structureService.getMessageStructureForUser(id, authentication.getName());
        if(messageStructure == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return messageStructure;
    }

    @RequestMapping(value = "api/structure-editor/segments/{id}", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    Segment segment(@PathVariable("id") String id, Authentication authentication) {
        Segment segment = structureService.getSegmentForUser(id, authentication.getName());
        if(segment == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return segment;
    }

    @RequestMapping(value = "/api/structure-editor/structure/{id}/state", method = RequestMethod.GET, produces = {
            "application/json" })
    public MessageStructureState messageState(@PathVariable("id") String id, Authentication authentication) {
        MessageStructure messageStructure = structureService.getMessageStructureForUser(id, authentication.getName());
        if(messageStructure == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return structureService.getMessageStructureState(messageStructure);
    }
    

    @RequestMapping(value = "/api/structure-editor/structure/{id}/custom-children", method = RequestMethod.GET, produces = {
            "application/json" })
    public Set<DisplayElement> customChildren(@PathVariable("id") String id, Authentication authentication) {
        MessageStructure messageStructure = structureService.getMessageStructureForUser(id, authentication.getName());
        if(messageStructure == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return structureService.getCustomSegments(messageStructure);
    }

    @RequestMapping(value = "/api/structure-editor/segment/{id}/state", method = RequestMethod.GET, produces = {
            "application/json" })
    public SegmentStructureState segmentState(@PathVariable("id") String id, Authentication authentication) {
        Segment segment = structureService.getSegmentForUser(id, authentication.getName());
        if(segment == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return structureService.getSegmentStructureState(segment);
    }

    @RequestMapping(value = "/api/structure-editor/valueSets/{type}/{id}", method = RequestMethod.GET, produces = {
            "application/json" })
    public List<DisplayElement> getResourceValueSets(@PathVariable("type") Type type, @PathVariable("id") String id, Authentication authentication) {
        return this.structureService.getResourceValueSets(type, id);
    }

    @RequestMapping(value = "/api/structure-editor/structure/resources/{type}/{scope}/{version}", method = RequestMethod.GET, produces = {
            "application/json" })

    public List<DisplayElement> getResources(@PathVariable("type") Type type, @PathVariable String version, @PathVariable Scope scope, Authentication authentication) {
        return this.structureService.getResources(type, scope, version, authentication.getName());
    }
}
