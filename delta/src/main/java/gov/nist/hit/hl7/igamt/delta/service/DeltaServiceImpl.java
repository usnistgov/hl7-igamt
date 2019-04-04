package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.PrimitiveDatatype;
import gov.nist.hit.hl7.igamt.delta.domain.IGDelta;
import gov.nist.hit.hl7.igamt.delta.domain.Tuple;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nist.diff.domain.DeltaMode;
import gov.nist.diff.domain.DeltaObject;
import gov.nist.diff.service.DeltaProcessor;
import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.delta.domain.DiffableResult;
import gov.nist.hit.hl7.igamt.delta.domain.EntityDelta;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DeltaServiceImpl implements DeltaService {

    @Autowired
    public ConformanceProfileService conformanceProfileService;
    @Autowired
    public SegmentService segmentService;
    @Autowired
    public DatatypeService datatypeService;
    @Autowired
    public IgRepository igRepository;
    @Autowired
    public IgService igService;

    public <T extends SectionInfo, E extends AbstractDomain> EntityDelta<T> compute(String id,
                                                                                    AbstractDomain document, Function<E, Boolean, T> converter,
                                                                                    java.util.function.Function<String, E> repository) throws Exception {

        // Get TARGET from repository
        E target = repository.apply(id);

        if (target == null) {
            throw new Exception("Target not found");
        }

        // Get SOURCE from repository using origin ID
        E source = repository.apply(target.getOrigin());


        DeltaProcessor processor = new DeltaProcessor();

        if (source == null) {
            throw new Exception();
        }

        // Convert TARGET and SOURCE to display
        T targetDisplayModel = converter.apply(target, true);
        T sourceDisplayModel = converter.apply(source, true);

        // Calculate Delta Between Display Models
        DeltaObject<T> delta =
                processor.objectDelta(sourceDisplayModel, targetDisplayModel, DeltaMode.INCLUSIVE);
        return new EntityDelta<>(document, sourceDisplayModel, targetDisplayModel, delta);

    }

    @Override
    public <T> EntityDelta<T> computeDelta(Type type, String documentId, String entityId)
            throws Exception {
        Ig sourceIg = this.igService.findById(documentId);
        switch (type) {
            case SEGMENT:
                return (EntityDelta<T>) this.compute(
                        entityId,
                        sourceIg,
                        this.segmentService::convertDomainToDisplayStructure,
                        this.segmentService::findById
                );
            case DATATYPE:
                return (EntityDelta<T>) this.compute(
                        entityId,
                        sourceIg,
                        this.datatypeService::convertDomainToStructureDisplay,
                        this.datatypeService::findById
                );
            case CONFORMANCEPROFILE:
                return (EntityDelta<T>) this.compute(
                        entityId,
                        sourceIg,
                        this.conformanceProfileService::convertDomainToDisplayStructure,
                        this.conformanceProfileService::findById
                );
        }
        return null;
    }

    @Override
    public IGDelta computeIgDelta(String igId) throws Exception {
        DeltaProcessor processor = new DeltaProcessor();
        Ig ig = this.igService.findById(igId);
        Map<String, Datatype> datatypeMap = new HashMap<>();
        if (ig != null) {
            Ig origin = this.igService.findById(ig.getOrigin());
            Map<String, Datatype> originDT = origin
                    .getDatatypeRegistry()
                    .getChildren()
                    .stream()
                    .map( link -> this.datatypeService.findById(link.getId()))
                    .collect(Collectors.toMap(dt -> dt.getId(), dt -> dt));


            Map<Datatype, Set<Datatype>> datatypesCrossRef = this.datatypeCrossRef(ig, datatypeMap);
        }
        return null;
    }

    public Map<String, DeltaAction> processDatatypesDelta(Map<String, Datatype> datatypeMap, Map<Datatype, Set<Datatype>> xref, Map<String, DeltaAction> actions, List<String> originIds) {
        DeltaProcessor processor = new DeltaProcessor();
        xref
                .entrySet()
                .stream()
                .filter(e -> e.getValue().size() > 0)
                .map(e -> e.getKey().getId())
                .forEach(id -> {
                    Datatype datatype = datatypeMap.get(id);
                    if(datatype.getOrigin() != null) {


                    } else {
                        actions.put(id, DeltaAction.ADDED);
                    }
                });
        return null;
    }

    Map<Datatype, Set<Datatype>> datatypeCrossRef(Ig ig, Map<String, Datatype> datatypeMap) {
        return ig.getDatatypeRegistry().getChildren()
                .stream()
                .filter(link -> !link.getDomainInfo().getScope().equals(Scope.USER))
                .map(link -> {
                    Datatype datatype = this.datatypeService.findById(link.getId());
                    datatypeMap.put(datatype.getId(), datatype);

                    if (datatype instanceof ComplexDatatype) {
                        return ((ComplexDatatype) datatype)
                                .getComponents()
                                .stream()
                                .map(component -> {
                                    if(!datatypeMap.containsKey(component.getRef().getId())) {
                                        Datatype dt = this.datatypeService.findById(component.getRef().getId());
                                        datatypeMap.put(dt.getId(), dt);
                                        return dt;
                                    } else {
                                        return datatypeMap.get(component.getRef().getId());
                                    }
                                })
                                .collect(Collectors.collectingAndThen(
                                        Collectors.toSet(),
                                        set -> {
                                            return new Tuple<Datatype, Set<Datatype>>(datatype, set);
                                        }
                                ));
                    } else {
                        return new Tuple<Datatype, Set<Datatype>>(datatype, new HashSet<>());
                    }
                })
                .collect(Collectors.toMap( e -> e.getKey(), e -> e.getValue()));
    }
}

