package gov.nist.hit.hl7.igamt.delta.service;

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

    E target = repository.apply(id);
    E source = repository.apply(target.getOrigin());
    DeltaProcessor processor = new DeltaProcessor();

    if (target == null || source == null) {
      throw new Exception();
    } else {
      T targetDisplayModel = converter.apply(target, true);
      T sourceDisplayModel = converter.apply(source, true);

      DeltaObject<T> delta =
          processor.objectDelta(sourceDisplayModel, targetDisplayModel, DeltaMode.INCLUSIVE);
      return new EntityDelta<>(document, sourceDisplayModel, targetDisplayModel, delta);
    }
  }



  @Override
  public DiffableResult diffable(Type type, String ig, String source, String target) {
    boolean diffable;
    switch (type) {
      case SEGMENT:
        diffable = !this.igRepository.segmentsInSameIg(this.convertToObjectd(ig),
            this.convertToObjectd(source), this.convertToObjectd(target));
        System.out
            .println("[HTM] " + diffable + " ig " + ig + " source " + source + " target " + target);
        if (diffable) {
          Segment segment = this.segmentService.findById(source);
          return new DiffableResult(diffable, segment);
        }
        break;
      case DATATYPE:
        diffable = !this.igRepository.datatypesInSameIg(this.convertToObjectd(ig),
            this.convertToObjectd(source), this.convertToObjectd(target));
        if (diffable) {
          Datatype datatype = this.datatypeService.findById(source);
          return new DiffableResult(diffable, datatype);
        }
        break;
      case CONFORMANCEPROFILE:
        diffable = !this.igRepository.conformanceProfilesInSameIg(this.convertToObjectd(ig),
            this.convertToObjectd(source), this.convertToObjectd(target));

        ConformanceProfile sourceP = this.conformanceProfileService.findById(source);

        if (diffable && sourceP.getDomainInfo().getScope().equals(Scope.USER)) {
          ConformanceProfile confProfile = this.conformanceProfileService.findById(source);
          return new DiffableResult(diffable, confProfile);
        }
        break;
      default:
        return new DiffableResult();
    }

    return new DiffableResult();
  }

  private ObjectId convertToObjectd(String id) {
    return new ObjectId(id);
  }

  @Override
  public <T> EntityDelta<T> computeDelta(Type type, String documentId, String entityId)
      throws Exception {
    Ig sourceIg = this.igService.findById(documentId);
    switch (type) {
      case SEGMENT:
        return (EntityDelta<T>) this.compute(entityId, sourceIg,
            this.segmentService::convertDomainToDisplayStructure, this.segmentService::findById);
      case DATATYPE:
        return (EntityDelta<T>) this.compute(entityId, sourceIg,
            this.datatypeService::convertDomainToStructureDisplay, this.datatypeService::findById);
      case CONFORMANCEPROFILE:
        return (EntityDelta<T>) this.compute(entityId, sourceIg,
            this.conformanceProfileService::convertDomainToDisplayStructure,
            this.conformanceProfileService::findById);
    }
    return null;
  }
}

