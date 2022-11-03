package gov.nist.hit.hl7.igamt.structure.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.impl.ConformanceProfileServiceImpl;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.service.DisplayInfoService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.structure.domain.*;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class StructureServiceImpl implements StructureService {

    @Autowired
    MessageStructureRepository messageStructureRepository;
    @Autowired
    SegmentRepository segmentRepository;
    @Autowired
    SegmentService segmentService;
    @Autowired
    DatatypeService datatypeService;
    @Autowired
    ConformanceProfileServiceImpl conformanceProfileService;
    @Autowired
    DisplayInfoService displayInfoService;
    @Autowired
    MongoTemplate mongoTemplate;
    @Autowired
    BindingService bindingService;
    @Autowired
    ValuesetService valuesetService;

    public void validate(Set<SegmentRefOrGroup> children) throws InvalidStructureException {
        // Position 1 is MSH
        Optional<SegmentRefOrGroup> HEAD = children.stream()
                .filter((s -> s.getPosition() == 1))
                .findFirst();

        if(HEAD.isPresent()) {
            if(HEAD.get() instanceof SegmentRef) {
                SegmentRef ref = (SegmentRef) HEAD.get();
                if(!ref.getName().equals("MSH")) {
                    throw new InvalidStructureException("First message structure element must be MSH");
                }
            } else {
                throw new InvalidStructureException("First message structure element must be MSH");
            }
        }

        // Groups are valid
        for(SegmentRefOrGroup refOrGroup: children) {
            if(refOrGroup instanceof Group) {
                this.checkGroup((Group) refOrGroup);
            }
        }

    }

    public void checkGroup(Group group) throws InvalidStructureException {
        if(!this.groupNameIsValid(group.getName())) {
            throw new InvalidStructureException("Group name " + group.getName() + " is invalid, only letters and underscores permitted");
        }

        if(group.getChildren() == null || group.getChildren().size() == 0) {
            throw new InvalidStructureException("Group " + group.getName() + " can't be empty");
        }

        for(SegmentRefOrGroup refOrGroup: group.getChildren()) {
            if(refOrGroup instanceof Group) {
                this.checkGroup((Group) refOrGroup);
            }
        }
    }

    public boolean groupNameIsValid(String name) {
        return !Strings.isNullOrEmpty(name) && name.matches("[a-zA-Z]+[a-zA-Z_]*");
    }

    @Override
    public List<MessageStructure> getUserCustomMessageStructure(String user) {
        return this.messageStructureRepository.findByCustomTrueAndParticipantsContaining(user);
    }

    @Override
    public MessageStructure saveMessageStructure(String id, String user, Set<SegmentRefOrGroup> children) throws InvalidStructureException {
        MessageStructure messageStructure = this.messageStructureRepository.findByCustomTrueAndParticipantsContainingAndId(user, id);
        if(messageStructure == null) {
            throw new IllegalArgumentException("Message structure can not be saved, incorrect scope or user");
        } else if(Status.PUBLISHED.equals(messageStructure.getStatus())) {
            throw new IllegalArgumentException("Locked Message structure can not be edited");
        } else {
            this.validate(children);
            messageStructure.setChildren(children);
            return this.messageStructureRepository.save(messageStructure);
        }
    }

    @Override
    public MessageStructure saveMessageMetadata(String id, String user, MessageStructureMetadata metadata) throws Exception {
        MessageStructure messageStructure = this.messageStructureRepository.findByCustomTrueAndParticipantsContainingAndId(user, id);
        if(messageStructure == null) {
            throw new IllegalArgumentException("Message metadata can not be saved, message not found for user");
        } else if(Status.PUBLISHED.equals(messageStructure.getStatus())) {
            throw new IllegalArgumentException("Message metadata can not be saved");
        } else {
            // Check StructureId
            if(Strings.isNullOrEmpty(metadata.getStructId())) {
                throw new Exception("Structure Id is required");
            }
            if(!metadata.getStructId().matches("[A-Z][A-Z0-9]{2}(_[A-Z][A-Z0-9]{2})?")) {
                throw new Exception("Structure Id is not valid, value should be AXX[_AXX] where A is a letter and X is an alphanumerical");
            }
            // Check MessageType
            if(Strings.isNullOrEmpty(metadata.getMessageType())) {
                throw new Exception("Message Type is required");
            }
            if(!metadata.getMessageType().matches("[A-Z][A-Z0-9]{2}")) {
                throw new Exception("Message Type is not valid, value should be AXX where A is a letter and X is an alphanumerical");
            }
            // Check events
            if(metadata.getEvents() == null || metadata.getEvents().isEmpty()) {
                throw new Exception("Message Events are required");
            }

            for(Event e: metadata.getEvents()) {
                if(Strings.isNullOrEmpty(e.getName())) {
                    throw new Exception("Event name is required");
                }
                if(!e.getName().matches("[A-Z][A-Z0-9]{2}")) {
                    throw new Exception("Event name is not valid, value should be AXX where A is a letter and X is an alphanumerical");
                }
                e.setParentStructId(messageStructure.getStructID());
                if(e.getId() == null) {
                    e.setId(new ObjectId().toHexString());
                }
                e.setHl7Version(messageStructure.getDomainInfo().getVersion());
                e.setType(Type.EVENT);
            }
            messageStructure.setStructID(metadata.getStructId());
            messageStructure.setMessageType(metadata.getMessageType());
            messageStructure.setDescription(metadata.getDescription());
            messageStructure.setEvents(metadata.getEvents());
            return this.messageStructureRepository.save(messageStructure);
        }
    }

    @Override
    public Segment saveSegment(String id, String user, Set<Field> children) {
        Segment segment = this.segmentRepository.findByCustomTrueAndUsernameAndId(user, id);
        if(segment == null) {
            throw new IllegalArgumentException("Segment structure can not be saved, segment not found for user");
        } else if(Status.PUBLISHED.equals(segment.getStatus())) {
            throw new IllegalArgumentException("Locked Segment structure can not be saved");
        } else {
            segment.setChildren(children);
            return this.segmentRepository.save(segment);
        }
    }

    @Override
    public Segment saveSegmentMetadata(String id, String user, SegmentStructureMetadata metadata) {
        Segment segment = this.segmentRepository.findByCustomTrueAndUsernameAndId(user, id);
        if(segment == null) {
            throw new IllegalArgumentException("Segment structure can not be saved, segment not found for user");
        } else if(Status.PUBLISHED.equals(segment.getStatus())) {
            throw new IllegalArgumentException("Locked Segment structure can not be saved, locked");
        } else {
            /// TODO Extension Unique
            segment.setExt(metadata.getIdentifier());
            segment.setDescription(metadata.getDescription());
            if(!Strings.isNullOrEmpty(metadata.getName()) && !segment.getName().equals(metadata.getName())) {
                if(!metadata.getName().matches("Z[A-Z0-9]{2}")) {
                    throw new IllegalArgumentException("Name Does not match the pattern Z[A-Z0-9]{2}");
                }

                if(segment.getName().startsWith("Z")) {
                    segment.setName(metadata.getName());
                } else {
                    throw new IllegalArgumentException("The resource is not a Z segment");
                }
            }
            return this.segmentRepository.save(segment);
        }
    }

    @Override
    public MessageStructure getMessageStructureForUser(String id, String user) {
        return this.messageStructureRepository.findByCustomTrueAndParticipantsContainingAndId(user, id);
    }

    @Override
    public Segment getSegmentForUser(String id, String user) {
        return this.segmentRepository.findByCustomTrueAndUsernameAndId(user, id);
    }

    private Set<Segment> getDependentSegments(MessageStructure structure) {
        Set<String> segmentIds = collectSegmentIds(structure);
        List<Segment> segmentList = this.segmentService.findByIdIn(segmentIds);
        return  new HashSet<>(segmentList);
    }

    private Set<Resource> getDependentDatatypes(Segment segment) {
        HashMap<String, Resource> usedDatatypes = new HashMap<String, Resource>();
        this.segmentService.collectResources(segment, usedDatatypes);
        return new HashSet<>(usedDatatypes.values());
    }

    private Set<Resource> getDependentDatatypes(Datatype datatype) {
        HashMap<String, Resource> usedDatatypes = new HashMap<String, Resource>();
        this.datatypeService.collectResources(datatype, usedDatatypes);
        return new HashSet<>(usedDatatypes.values());
    }

    private List<Valueset> getDependentValueSet(Set<Resource> resources) {
        Set<String> valueSetIds = resources.stream()
                .map(resource -> {
                    if(resource instanceof Datatype) {
                        return ((Datatype) resource).getBinding();
                    } else if(resource instanceof Segment) {
                        return ((Segment) resource).getBinding();
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .flatMap(resourceBinding -> bindingService.processBinding(resourceBinding).stream())
                .collect(Collectors.toSet());
        return valuesetService.findByIdIn(valueSetIds);
    }

    @Override
    public List<DisplayElement> getResourceValueSets(Type type, String id) {
        Resource resource = null;

        switch (type) {
            case DATATYPE:
                resource = this.datatypeService.findById(id);
                break;
            case SEGMENT:
                resource = this.segmentService.findById(id);
                break;
        }

        if(resource != null && (resource.getDomainInfo().getScope().equals(Scope.HL7STANDARD) || resource.getDomainInfo().getScope().equals(Scope.USERCUSTOM))) {
            return this.getResourceValueSets(resource);
        } else {
            return null;
        }
    }

    public List<DisplayElement> getResourceValueSets(Resource resource) {
        Set<Resource> resourceList = new HashSet<>();
        resourceList.add(resource);

        if(resource instanceof Datatype) {
            resourceList.addAll(this.getDependentDatatypes((Datatype) resource));
        } else if(resource instanceof Segment) {
            resourceList.addAll(this.getDependentDatatypes((Segment) resource));
        } else if(resource instanceof MessageStructure) {
            Set<Segment> segmentList = this.getDependentSegments((MessageStructure) resource);
            Set<Resource> datatypeList = segmentList.stream().flatMap((segment) -> this.getDependentDatatypes(segment).stream())
                    .collect(Collectors.toSet());
            resourceList.addAll(segmentList);
            resourceList.addAll(datatypeList);
        }

        return this.getDependentValueSet(resourceList).stream().map((vs) -> this.displayInfoService.convertValueSet(vs)).collect(Collectors.toList());
    }

    @Override
    public MessageStructureState getMessageStructureState(MessageStructure structure) {
        MessageStructureState state = new MessageStructureState();
        state.setStructure(structure);

        Set<Segment> segmentList = this.getDependentSegments(structure);
        Set<Resource> datatypeList = segmentList.stream().flatMap((segment) -> this.getDependentDatatypes(segment).stream())
                .collect(Collectors.toSet());

        state.setResources(Stream.concat(segmentList.stream(), datatypeList.stream()).collect(Collectors.toSet()));
        state.setValuesets(this.getDependentValueSet(state.getResources()).stream().map((vs) -> this.displayInfoService.convertValueSet(vs)).collect(Collectors.toList()));
        state.setDatatypes(datatypeList.stream().map((datatype) -> this.displayInfoService.convertDatatype((Datatype) datatype)).collect(Collectors.toList()));
        state.setSegments(segmentList.stream().map((segment) -> this.displayInfoService.convertSegment(segment)).collect(Collectors.toList()));

       return state;
    }
    
    @Override
    public Set<DisplayElement> getCustomSegments(MessageStructure structure) {
        MessageStructureState state = new MessageStructureState();
        state.setStructure(structure);

        Set<Segment> segmentList = this.getDependentSegments(structure);
        Set<DisplayElement>  ret = segmentList.stream().filter((s) -> s.getDomainInfo().getScope().equals(Scope.USERCUSTOM)).map((segment) -> this.displayInfoService.convertSegment(segment)).collect(Collectors.toSet());

       return ret;
    }

    @Override
    public SegmentStructureState getSegmentStructureState(Segment structure) {
        SegmentStructureState state = new SegmentStructureState();
        state.setStructure(structure);

        Set<Resource> datatypeList = this.getDependentDatatypes(structure);

        state.setResources(datatypeList);
        state.setValuesets(this.getDependentValueSet(Stream.concat(state.getResources().stream(), Stream.of(structure)).collect(Collectors.toSet())).stream().map((vs) -> this.displayInfoService.convertValueSet(vs)).collect(Collectors.toList()));
        state.setDatatypes(datatypeList.stream().map((datatype) -> this.displayInfoService.convertDatatype((Datatype) datatype)).collect(Collectors.toList()));

        return state;
    }

    @Override
    public boolean deleteMessageStructure(String id, String user) {
        MessageStructure messageStructure = this.messageStructureRepository.findByCustomTrueAndParticipantsContainingAndId(user, id);
        if(messageStructure != null) {
            this.messageStructureRepository.delete(messageStructure);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteSegmentStructure(String id, String user) {
        Set<CustomSegmentCrossRef> refs = getSegmentStructureReferences(id, user);
        if(refs == null || refs.isEmpty()) {
            Segment segment = this.segmentRepository.findByCustomTrueAndUsernameAndIdAndDomainInfoScope(user,id,  Scope.USERCUSTOM);
            if(segment != null) {
                this.segmentRepository.delete(segment);
                return true;
            }
        }
        return false;
    }

    @Override
    public Set<CustomSegmentCrossRef> getSegmentStructureReferences(String id, String user) {
        Set<CustomSegmentCrossRef> crossRefs = new HashSet<>();
        List<MessageStructure> messageStructures  = getUserCustomMessageStructure(user);
        for(MessageStructure messageStructure: messageStructures) {
            DisplayElement displayElement = this.createDisplayElement(messageStructure);
            Set<ReferenceLocation> locations = getSegmentLocations(id, "", messageStructure.getChildren());
            for(ReferenceLocation referenceLocation: locations) {
                CustomSegmentCrossRef customSegmentCrossRef = new CustomSegmentCrossRef(
                        displayElement,
                        referenceLocation
                );
                crossRefs.add(customSegmentCrossRef);
            }
        }
        return crossRefs;
    }

    @Override
    public Set<CustomSegmentCrossRef> getLockedSegmentStructure(String id, String user) {
        Set<CustomSegmentCrossRef> crossRefs = new HashSet<>();
        List<MessageStructure> messageStructures  = this.messageStructureRepository.findByCustomTrueAndParticipantsContainingAndStatus(user, Status.PUBLISHED);
        for(MessageStructure messageStructure: messageStructures) {
            DisplayElement displayElement = this.createDisplayElement(messageStructure);
            Set<ReferenceLocation> locations = getSegmentLocations(id, "", messageStructure.getChildren());
            for(ReferenceLocation referenceLocation: locations) {
                CustomSegmentCrossRef customSegmentCrossRef = new CustomSegmentCrossRef(
                        displayElement,
                        referenceLocation
                );
                crossRefs.add(customSegmentCrossRef);
            }
        }
        return crossRefs;
    }
    
    public Set<ReferenceLocation> getSegmentLocations(String id, String path, Set<SegmentRefOrGroup> children) {
        Set<ReferenceLocation> locations = new HashSet<>();
        if(children == null || children.isEmpty()) {
            return null;
        } else {
            for(SegmentRefOrGroup child: children) {
                if(child instanceof Group) {
                    Group group = (Group) child;
                    Set<ReferenceLocation> childs = getSegmentLocations(id, this.concat(path, group.getName()), group.getChildren());
                    if(childs != null) {
                        locations.addAll(childs);
                    }
                } else {
                    SegmentRef segmentRef = (SegmentRef) child;
                    if(segmentRef.getRef().getId().equals(id)) {
                        locations.add(
                                new ReferenceLocation(Type.SEGMENTREF, this.concat(path, segmentRef.getPosition() + ""), segmentRef.getName())
                        );
                    }
                }
            }
            return locations;
        }
    }

    public String concat(String a, String b) {
        if(a != null && !a.isEmpty()) {
            return a + "." + b;
        } else {
            return b;
        }
    }

    public Set<String> collectSegmentIds(MessageStructure cp) {
        Set<String> ids = new HashSet<String>();
        for (MsgStructElement segOrgroup : cp.getChildren()) {
            if (segOrgroup instanceof SegmentRef) {
                SegmentRef ref = (SegmentRef) segOrgroup;
                if (ref.getRef() != null && ref.getRef().getId() != null)
                    ids.add(ref.getRef().getId());
            } else {
                this.conformanceProfileService.processSegmentorGroup(segOrgroup, ids);
            }
        }
        return ids;
    }

    @Override
    public List<Segment> getUserCustomSegment(String user) {
        return this.segmentRepository.findByCustomTrueAndUsernameAndDomainInfoScope(user, Scope.USERCUSTOM);
    }

    @Override
    public MessageStructureAndDisplay createMessageStructure(MessageStructureCreateWrapper request, String user) throws Exception {
        MessageStructure structure = this.messageStructureRepository.findOneById(request.getFrom());

        // Check StructureId
        if(Strings.isNullOrEmpty(request.getStructureId())) {
            throw new Exception("Structure Id is required");
        }
        if(!request.getStructureId().matches("[A-Z][A-Z0-9]{2}(_[A-Z][A-Z0-9]{2})?")) {
            throw new Exception("Structure Id is not valid, value should be AXX[_AXX] where A is a letter and X is an alphanumerical");
        }
        // Check MessageType
        if(Strings.isNullOrEmpty(request.getMessageType())) {
            throw new Exception("Message Type is required");
        }
        if(!request.getMessageType().matches("[A-Z][A-Z0-9]{2}")) {
            throw new Exception("Message Type is not valid, value should be AXX where A is a letter and X is an alphanumerical");
        }
        // Check events
        if(request.getEvents() == null || request.getEvents().isEmpty()) {
            throw new Exception("Message Events are required");
        }
        List<Event> events = new ArrayList<>();
        for(MessageEvent ev: request.getEvents()) {
            if(Strings.isNullOrEmpty(ev.getName())) {
                throw new Exception("Event name is required");
            }
            if(!ev.getName().matches("[A-Z][A-Z0-9]{2}")) {
                throw new Exception("Event name is not valid, value should be AXX where A is a letter and X is an alphanumerical");
            }
            Event event = new Event();
            event.setId(new ObjectId().toHexString());
            event.setParentStructId(request.getStructureId());
            event.setHl7Version(structure.getDomainInfo().getVersion());
            event.setDescription(ev.getDescription());
            event.setName(ev.getName());
            event.setType(Type.EVENT);
            events.add(event);
        }

        structure.setStructID(request.getStructureId());
        structure.setDescription(request.getDescription());
        structure.setMessageType(request.getMessageType());
        structure.setOrigin(request.getFrom());
        structure.setEvents(events);
        structure.setId(null);
        structure.setStatus(null);
        structure.setParticipants(Collections.singletonList(user));
        structure.setCustom(true);
        structure.setVersion(null);
        structure.getDomainInfo().setScope(Scope.USERCUSTOM);
        this.messageStructureRepository.save(structure);

        MessageStructureAndDisplay response = new MessageStructureAndDisplay();
        response.setStructure(structure);
        response.setDisplayElement(this.createDisplayElement(structure));
        return response;
    }

    @Override
    public SegmentStructureAndDisplay createSegmentStructure(SegmentStructureCreateWrapper request, String user) {
        Segment structure = this.segmentRepository.findById(request.getFrom()).orElseThrow(() -> new IllegalArgumentException("Segment not found"));
        if(!Strings.isNullOrEmpty(request.getZname())) {
        	if(!request.getZname().matches("Z[A-Z0-9]{2}")) {
        		throw new IllegalArgumentException("Name Does not match the pattern Z[A-Z0-9]{2}");
        	}

        	if(structure.getName().startsWith("Z")) {
        		structure.setName(request.getZname());
        	} else {
        		throw new IllegalArgumentException("The resource is not a Z segment");
        	}
        }
        structure.setDescription(request.getDescription());
        structure.setExt(request.getIdentifier());
        structure.setOrigin(request.getFrom());
        structure.setId(null);
        structure.setStatus(null);
        structure.setUsername(user);
        structure.setCustom(true);
        structure.setVersion(null);
        structure.getDomainInfo().setScope(Scope.USERCUSTOM);
        this.segmentRepository.save(structure);

        SegmentStructureAndDisplay response = new SegmentStructureAndDisplay();
        response.setStructure(structure);
        response.setDisplayElement(this.displayInfoService.convertSegment(structure));
        return response;
    }

    @Override
    public SegmentStructureAndDisplay publishSegment(String id, String user) {
        Segment segment = this.getSegmentForUser(id, user);
        if(segment!= null && !Status.PUBLISHED.equals(segment.getStatus())) {
            segment.setStatus(Status.PUBLISHED);
            segment.setFixedExtension(segment.getExt());
            segment.setExt(null);
            segment.setStructureIdentifier(segment.getId());
            this.segmentRepository.save(segment);
            SegmentStructureAndDisplay response = new SegmentStructureAndDisplay();
            response.setDisplayElement(this.displayInfoService.convertSegment(segment));
            response.setStructure(segment);
            return response;
        } else {
            throw new IllegalArgumentException("Segment Not Found");
        }
    }

    @Override
    public MessageStructureAndDisplay publishMessageStructure(String id, String user) {
        MessageStructure structure = this.getMessageStructureForUser(id, user);
        if(structure!= null && !Status.PUBLISHED.equals(structure.getStatus())) {
            structure.setStatus(Status.PUBLISHED);
            structure.setStructureIdentifier(structure.getId());
            if(structure.getEvents() != null) {
                structure.getEvents().forEach((e) -> {
                    e.setParentStructId(structure.getStructID());
                });
            }
            this.messageStructureRepository.save(structure);
            MessageStructureAndDisplay response = new MessageStructureAndDisplay();
            response.setDisplayElement(this.createDisplayElement(structure));
            response.setStructure(structure);
            return response;
        } else {
            throw new IllegalArgumentException("Message Not Found");
        }
    }
    
    @Override
    public SegmentStructureAndDisplay unpublishSegment(String id, String user) {
        Segment segment = this.segmentRepository.findOneById(id);
        if(segment!= null && Status.PUBLISHED.equals(segment.getStatus())) {
        	Set<CustomSegmentCrossRef>  refs= this.getLockedSegmentStructure(id, user);
        	if(refs == null || refs.size() ==0) {
            segment.setExt(segment.getFixedExtension());
            segment.setFixedExtension(null);
            segment.setStatus(null);
            segment.setStructureIdentifier(segment.getId());
            this.segmentRepository.save(segment);
            SegmentStructureAndDisplay response = new SegmentStructureAndDisplay();
            response.setDisplayElement(this.displayInfoService.convertSegment(segment));
            response.setStructure(segment);
            
            return response;
        	} else {
                throw new IllegalArgumentException("Segment Used in Published Structures");
        	}
        	
        } else {
            throw new IllegalArgumentException("Segment Not Found");
        }
    }

    @Override
    public MessageStructureAndDisplay unpublishMessageStructure(String id, String user) {
        MessageStructure structure = this.getMessageStructureForUser(id, user);
        if(structure!= null && Status.PUBLISHED.equals(structure.getStatus())) {
            structure.setStatus(null);
            structure.setStructureIdentifier(structure.getId());
            this.messageStructureRepository.save(structure);
            MessageStructureAndDisplay response = new MessageStructureAndDisplay();
            response.setDisplayElement(this.createDisplayElement(structure));
            response.setStructure(structure);
            return response;
        } else {
            throw new IllegalArgumentException("Message Not Found");
        }
    }

    public DisplayElement createDisplayElement(MessageStructure ms) {
        DisplayElement elm = new DisplayElement();
        DomainInfo domainInfo = new DomainInfo();

        domainInfo.setScope(Scope.USERCUSTOM);
        domainInfo.setVersion(ms.getDomainInfo().getVersion());

        elm.setId(ms.getId());
        elm.setFixedName(ms.getStructID());
        elm.setType(Type.CONFORMANCEPROFILE);
        elm.setLeaf(true);
        elm.setDomainInfo(domainInfo);
        elm.setDescription(ms.getDescription());
        elm.setOrigin(ms.getOrigin());
        elm.setStatus(ms.getStatus());

        return elm;
    }

    @Override
    public CustomStructureRegistry getCustomStructureRegistry(String user) {
        List<MessageStructure> messageStructures = this.getUserCustomMessageStructure(user);
        List<Segment> segments = this.getUserCustomSegment(user);

        CustomStructureRegistry registry = new CustomStructureRegistry();
        registry.setMessageStructureRegistry(messageStructures.stream().map(this::createDisplayElement).collect(Collectors.toList()));
        registry.setSegmentStructureRegistry(segments.stream().map(this.displayInfoService::convertSegment).collect(Collectors.toList()));

        return registry;
    }

    @Override
    public List<DisplayElement> getResources(Type type, Scope scope, String version, String username) {
        Criteria criteria = new Criteria();
        criteria.and("domainInfo.scope").is(scope);
        criteria.and("domainInfo.version").is(version);

        if(!scope.equals(Scope.HL7STANDARD)) {
            criteria.and("username").in(username);
        }

        if(scope.equals(Scope.USERCUSTOM)) {
            criteria.and("status").is(Status.PUBLISHED);
        }


        Query qry = Query.query(criteria);
        switch (type) {
            case SEGMENT:
                return mongoTemplate.find(qry, Segment.class).stream()
                        .map(segment -> this.displayInfoService.convertSegment(segment))
                        .collect(Collectors.toList());
            case DATATYPE:
                return mongoTemplate.find(qry, Datatype.class).stream()
                        .map(datatype -> this.displayInfoService.convertDatatype(datatype))
                        .collect(Collectors.toList());
            case VALUESET:
                return mongoTemplate.find(qry, Valueset.class).stream()
                        .map(vs -> this.displayInfoService.convertValueSet(vs))
                        .collect(Collectors.toList());
            default:
                return null;
        }
    }
}
