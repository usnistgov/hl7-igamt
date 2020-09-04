package gov.nist.hit.hl7.igamt.structure.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
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

    @Override
    public List<MessageStructure> getUserCustomMessageStructure(String user) {
        return this.messageStructureRepository.findByCustomTrueAndParticipantsContaining(user);
    }

    @Override
    public MessageStructure saveMessageStructure(String id, String user, Set<SegmentRefOrGroup> children) {
        MessageStructure messageStructure = this.messageStructureRepository.findByCustomTrueAndParticipantsContainingAndId(user, id);
        if(messageStructure != null) {
            messageStructure.setChildren(children);
            return this.messageStructureRepository.save(messageStructure);
        } else {
            throw new IllegalArgumentException("Can't save message structure, incorrect scope or user");
        }
    }

    @Override
    public MessageStructure saveMessageMetadata(String id, String user, MessageStructureMetadata metadata) {
        MessageStructure messageStructure = this.messageStructureRepository.findByCustomTrueAndParticipantsContainingAndId(user, id);
        if(messageStructure != null) {
            messageStructure.setStructID(metadata.getStructId());
            messageStructure.setMessageType(metadata.getMessageType());
            messageStructure.setDescription(metadata.getDescription());
            messageStructure.setEvents(metadata.getEvents());
            return this.messageStructureRepository.save(messageStructure);
        } else {
            throw new IllegalArgumentException("Can't save message metadata, message not found for user");
        }
    }

    @Override
    public Segment saveSegment(String id, String user, Set<Field> children) {
        Segment segment = this.segmentRepository.findByCustomTrueAndUsernameAndId(user, id);
        if(segment != null) {
            segment.setChildren(children);
            return this.segmentRepository.save(segment);
        } else {
            throw new IllegalArgumentException("Can't save segment structure, segment not found for user");
        }
    }

    @Override
    public Segment saveSegmentMetadata(String id, String user, SegmentStructureMetadata metadata) {
        Segment segment = this.segmentRepository.findByCustomTrueAndUsernameAndId(user, id);
        if(segment != null) {
            /// TODO Extension Unique
            segment.setExt(metadata.getIdentifier());
            segment.setDescription(metadata.getDescription());
            return this.segmentRepository.save(segment);
        } else {
            throw new IllegalArgumentException("Can't save segment structure, incorrect scope or user");
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
    public SegmentStructureState getSegmentStructureState(Segment structure) {
        SegmentStructureState state = new SegmentStructureState();
        state.setStructure(structure);

        Set<Resource> datatypeList = this.getDependentDatatypes(structure);

        state.setResources(datatypeList);
        state.setValuesets(this.getDependentValueSet(Stream.concat(state.getResources().stream(), Stream.of(structure)).collect(Collectors.toSet())).stream().map((vs) -> this.displayInfoService.convertValueSet(vs)).collect(Collectors.toList()));
        state.setDatatypes(datatypeList.stream().map((datatype) -> this.displayInfoService.convertDatatype((Datatype) datatype)).collect(Collectors.toList()));

        return state;
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
        return this.segmentRepository.findByCustomTrueAndUsername(user);
    }

    @Override
    public MessageStructureAndDisplay createMessageStructure(MessageStructureCreateWrapper request, String user) {
        MessageStructure structure = this.messageStructureRepository.findOneById(request.getFrom());
        structure.setStructID(request.getName());
        structure.setDescription(request.getDescription());
        structure.setOrigin(request.getFrom());
        request.getEvents().forEach((event) -> {
            if(Strings.isNullOrEmpty(event.getId())) {
                event.setId(new ObjectId().toHexString());
            }
        });
        structure.setEvents(request.getEvents());
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
