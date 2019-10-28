package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.delta.domain.*;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
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
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import java.util.List;

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
  @Autowired
  public EntityDeltaServiceImpl entityDeltaService;

  public Delta delta(Type type, String documentId, String entityId) {
    Ig targetIg = this.igService.findById(documentId);
    Ig sourceIg = this.igService.findById(targetIg.getFrom());

    if(type.equals(Type.DATATYPE)) {

      Datatype target = this.datatypeService.findById(entityId);
      Datatype source = this.datatypeService.findById(target.getOrigin());

      DatatypeStructureDisplay sourceDisplay = this.datatypeService.convertDomainToStructureDisplay(source, true);
      DatatypeStructureDisplay targetDisplay = this.datatypeService.convertDomainToStructureDisplay(target, true);

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), source.getExt(), source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), target.getExt(), target.getDescription(), target.getId());

      List<StructureDelta> structure = entityDeltaService.datatype(sourceDisplay, targetDisplay);

      return new Delta(sourceInfo, targetInfo, structure);

    } else if(type.equals(Type.SEGMENT)) {

      Segment target = this.segmentService.findById(entityId);
      Segment source = this.segmentService.findById(target.getOrigin());

      SegmentStructureDisplay sourceDisplay = this.segmentService.convertDomainToDisplayStructure(source, true);
      SegmentStructureDisplay targetDisplay = this.segmentService.convertDomainToDisplayStructure(target, true);

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), source.getExt(), source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), target.getExt(), target.getDescription(), target.getId());

      List<StructureDelta> structure = entityDeltaService.segment(sourceDisplay, targetDisplay);

      return new Delta(sourceInfo, targetInfo, structure);

    } else if(type.equals(Type.CONFORMANCEPROFILE)) {


      ConformanceProfile target = this.conformanceProfileService.findById(entityId);
      ConformanceProfile source = this.conformanceProfileService.findById(target.getOrigin());

      ConformanceProfileStructureDisplay sourceDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(source, true);
      ConformanceProfileStructureDisplay targetDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(target, true);

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), null, source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), null, target.getDescription(), target.getId());

      List<StructureDelta> structure = entityDeltaService.conformanceProfile(sourceDisplay, targetDisplay);

      return new Delta(sourceInfo, targetInfo, structure);

    }

    return null;
  }

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

