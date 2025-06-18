package gov.nist.hit.hl7.igamt.web.app.resource;

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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashSet;
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
    MessageStructureAndDisplay createStructure(@RequestBody MessageStructureCreateWrapper request, Authentication authentication) throws Exception {
        return structureService.createMessageStructure(request, authentication.getName());
    }

    @RequestMapping(value = "api/structure-editor/segment", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    SegmentStructureAndDisplay createSegment(@RequestBody SegmentStructureCreateWrapper request, Authentication authentication) {
        return structureService.createSegmentStructure(request, authentication.getName());
    }

    @RequestMapping(value = "api/structure-editor/structure/{id}/save", method = RequestMethod.POST, produces = {"application/json" })
    @PreAuthorize("AccessResource('MESSAGESTRUCTURE', #id, WRITE)")
    public @ResponseBody
    ResponseMessage<Object> saveStructure(@PathVariable("id") String id, @RequestBody Set<SegmentRefOrGroup> children, Authentication authentication) throws InvalidStructureException {
        MessageStructure ms = structureService.saveMessageStructure(id, authentication.getName(), children);
        return new ResponseMessage<Object>(ResponseMessage.Status.SUCCESS, "MESSAGE STRUCTURE SAVED", ms.getId(), new Date());
    }

    @RequestMapping(value = "api/structure-editor/structure/{id}/metadata/save", method = RequestMethod.POST, produces = {"application/json" })
    @PreAuthorize("AccessResource('MESSAGESTRUCTURE', #id, WRITE)")
    public @ResponseBody
    ResponseMessage<Object> saveMetadata(@PathVariable("id") String id, @RequestBody MessageStructureMetadata metadata, Authentication authentication) throws Exception {
        MessageStructure ms = structureService.saveMessageMetadata(id, authentication.getName(), metadata);
        return new ResponseMessage<Object>(ResponseMessage.Status.SUCCESS, "MESSAGE METADATA SAVED", ms.getId(), new Date());
    }

    @RequestMapping(value = "api/structure-editor/segment/{id}/save", method = RequestMethod.POST, produces = {"application/json" })
    @PreAuthorize("AccessResource('SEGMENT', #id, WRITE)")
    public @ResponseBody
    ResponseMessage<Object> saveSegment(@PathVariable("id") String id, @RequestBody Set<Field> children, Authentication authentication) {
        Segment ms = structureService.saveSegment(id, authentication.getName(), children);
        return new ResponseMessage<Object>(ResponseMessage.Status.SUCCESS, "SEGMENT STRUCTURE SAVED", ms.getId(), new Date());
    }

    @RequestMapping(value = "api/structure-editor/segment/{id}/metadata/save", method = RequestMethod.POST, produces = {"application/json" })
    @PreAuthorize("AccessResource('SEGMENT', #id, WRITE)")
    public @ResponseBody
    ResponseMessage<Object> saveSegmentMetadata(@PathVariable("id") String id, @RequestBody SegmentStructureMetadata metadata, Authentication authentication) {
        Segment ms = structureService.saveSegmentMetadata(id, authentication.getName(), metadata);
        return new ResponseMessage<Object>(ResponseMessage.Status.SUCCESS, "SEGMENT METADATA SAVED", ms.getId(), new Date());
    }

    @RequestMapping(value = "api/structure-editor/segment/{id}/publish", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('SEGMENT', #id, WRITE)")
    public @ResponseBody
    ResponseMessage<SegmentStructureAndDisplay> publishSegment(@PathVariable("id") String id, Authentication authentication) {
        SegmentStructureAndDisplay ms = structureService.publishSegment(id, authentication.getName());
        return new ResponseMessage<SegmentStructureAndDisplay>(ResponseMessage.Status.SUCCESS, "SEGMENT STRUCTURE PUBLISHED", ms.getDisplayElement().getId(), ms, new Date());
    }

    @RequestMapping(value = "api/structure-editor/structure/{id}/publish", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('MESSAGESTRUCTURE', #id, WRITE)")
    public @ResponseBody
    ResponseMessage<MessageStructureAndDisplay> publishMessage(@PathVariable("id") String id, Authentication authentication) {
        MessageStructureAndDisplay ms = structureService.publishMessageStructure(id, authentication.getName());
        return new ResponseMessage<MessageStructureAndDisplay>(ResponseMessage.Status.SUCCESS, "MESSAGE STRUCTURE PUBLISHED", ms.getDisplayElement().getId(), ms, new Date());
    }
    
    @RequestMapping(value = "api/structure-editor/segment/{id}/unpublish", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('SEGMENT', #id, UNLOCK)")
    public @ResponseBody
    ResponseMessage<SegmentStructureAndDisplay> unpublishSegment(@PathVariable("id") String id, Authentication authentication) {
        SegmentStructureAndDisplay ms = structureService.unpublishSegment(id, authentication.getName());
        return new ResponseMessage<SegmentStructureAndDisplay>(ResponseMessage.Status.SUCCESS, "SEGMENT STRUCTURE UNLOCKED", ms.getDisplayElement().getId(), ms, new Date());
    }

    @RequestMapping(value = "api/structure-editor/structure/{id}/unpublish", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('MESSAGESTRUCTURE', #id, UNLOCK)")
    public @ResponseBody
    ResponseMessage<MessageStructureAndDisplay> unpublishMessage(@PathVariable("id") String id, Authentication authentication) {
        MessageStructureAndDisplay ms = structureService.unpublishMessageStructure(id, authentication.getName());
        return new ResponseMessage<MessageStructureAndDisplay>(ResponseMessage.Status.SUCCESS, "MESSAGE STRUCTURE UNLOCKED", ms.getDisplayElement().getId(), ms, new Date());
    }
    
    @RequestMapping(value = "api/structure-editor/structures/{id}", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('MESSAGESTRUCTURE', #id, READ)")
    public @ResponseBody
    MessageStructure structure(@PathVariable("id") String id, Authentication authentication) {
        MessageStructure messageStructure = structureService.getMessageStructureForUser(id, authentication.getName());
        if(messageStructure == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return messageStructure;
    }

    @RequestMapping(value = "api/structure-editor/segments/{id}", method = RequestMethod.GET, produces = {"application/json" })
    @PreAuthorize("AccessResource('SEGMENT', #id, READ)")
    public @ResponseBody
    Segment segment(@PathVariable("id") String id, Authentication authentication) {
        Segment segment = structureService.getSegmentForUser(id, authentication.getName());
        if(segment == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return segment;
    }

    @RequestMapping(value = "api/structure-editor/structure/{id}", method = RequestMethod.DELETE, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<String> structureDelete(@PathVariable("id") String id, Authentication authentication) throws Exception {
        boolean deleted = this.structureService.deleteMessageStructure(id, authentication.getName());
        if(deleted) {
            return new ResponseMessage<String>(ResponseMessage.Status.SUCCESS, "MESSAGE STRUCTURE DELETED", id, null, new Date());
        } else {
            throw new Exception("Unable to delete message structure "+ id);
        }
    }

    @RequestMapping(value = "api/structure-editor/segment/{id}", method = RequestMethod.DELETE, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<String> segmentDelete(@PathVariable("id") String id, Authentication authentication) throws Exception {
        boolean deleted = this.structureService.deleteSegmentStructure(id, authentication.getName());
        if(deleted) {
            return new ResponseMessage<String>(ResponseMessage.Status.SUCCESS, "SEGMENT STRUCTURE DELETED", id, null, new Date());
        } else {
            throw new Exception("Unable to delete segment structure "+ id);
        }
    }

    @RequestMapping(value = "api/structure-editor/segment/{id}/cross-references", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    Set<CustomSegmentCrossRef> segmentCrossRefs(@PathVariable("id") String id, Authentication authentication) throws Exception {
        Set<CustomSegmentCrossRef> crossRefs = this.structureService.getSegmentStructureReferences(id, authentication.getName());
        return crossRefs != null ? crossRefs : new HashSet<>();
    }
    
    @RequestMapping(value = "api/structure-editor/segment/{id}/locked-cross-references", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    Set<CustomSegmentCrossRef> lockedSegmentCrossRef(@PathVariable("id") String id, Authentication authentication) throws Exception {
        Set<CustomSegmentCrossRef> crossRefs = this.structureService.getLockedSegmentStructure(id, authentication.getName());
        return crossRefs != null ? crossRefs : new HashSet<>();
    }

    @RequestMapping(value = "/api/structure-editor/structure/{id}/state", method = RequestMethod.GET, produces = {
            "application/json" })
    @PreAuthorize("AccessResource('MESSAGESTRUCTURE', #id, READ)")
    public MessageStructureState messageState(@PathVariable("id") String id, Authentication authentication) {
        MessageStructure messageStructure = structureService.getMessageStructureForUser(id, authentication.getName());
        if(messageStructure == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return structureService.getMessageStructureState(messageStructure);
    }
    

    @RequestMapping(value = "/api/structure-editor/structure/{id}/custom-children", method = RequestMethod.GET, produces = {
            "application/json" })
    @PreAuthorize("AccessResource('MESSAGESTRUCTURE', #id, READ)")
    public Set<DisplayElement> customChildren(@PathVariable("id") String id, Authentication authentication) {
        MessageStructure messageStructure = structureService.getMessageStructureForUser(id, authentication.getName());
        if(messageStructure == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return structureService.getCustomSegments(messageStructure);
    }

    @RequestMapping(value = "/api/structure-editor/segment/{id}/state", method = RequestMethod.GET, produces = {
            "application/json" })
    @PreAuthorize("AccessResource('SEGMENT', #id, READ)")
    public SegmentStructureState segmentState(@PathVariable("id") String id, Authentication authentication) {
        Segment segment = structureService.getSegmentForUser(id, authentication.getName());
        if(segment == null) {
            throw new IllegalArgumentException("Not Found");
        }
        return structureService.getSegmentStructureState(segment);
    }

    @RequestMapping(value = "/api/structure-editor/valueSets/{type}/{id}", method = RequestMethod.GET, produces = {
            "application/json" })
    @PreAuthorize("AccessResource(#type.toString(), #id, READ)")
    public List<DisplayElement> getResourceValueSets(@PathVariable("type") Type type, @PathVariable("id") String id, Authentication authentication) {
        return this.structureService.getResourceValueSets(type, id);
    }

    @RequestMapping(value = "/api/structure-editor/structure/resources/{type}/{scope}/{version}", method = RequestMethod.GET, produces = {
            "application/json" })
    public List<DisplayElement> getResources(@PathVariable("type") Type type, @PathVariable String version, @PathVariable Scope scope, Authentication authentication) {
        return this.structureService.getResources(type, scope, version, authentication.getName());
    }
    
}
