package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.coconstraints.service.impl.CoConstraintDeltaService;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.delta.display.CompositeProfileDeltaDisplay;
import gov.nist.hit.hl7.igamt.delta.display.ProfileComponentLinkDeltaDisplay;
import gov.nist.hit.hl7.igamt.delta.domain.*;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.display.service.DisplayInfoService;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.diff.domain.DeltaMode;
import gov.nist.diff.domain.DeltaObject;
import gov.nist.diff.service.DeltaProcessor;
import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.model.CompositeProfile;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class DeltaServiceImpl implements DeltaService {

  @Autowired
  public ConformanceProfileService conformanceProfileService;
  @Autowired
  public CoConstraintService coConstraintService;
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
  @Autowired
  DisplayInfoService displayInfoService;
  @Autowired
  ValuesetService valuesetService;
  @Autowired
  CoConstraintDeltaService coConstraintDeltaService;
  @Autowired
  ProfileComponentService profileComponentService;
  @Autowired
  CompositeProfileStructureService compositeProfileStructureService;

  public Delta delta(Type type, String documentId, String entityId) throws EntityNotFound {
    Ig targetIg = this.igService.findById(documentId);
    Ig sourceIg = this.igService.findById(targetIg.getFrom());

    if(type.equals(Type.DATATYPE)) {


      Datatype target = this.datatypeService.findById(entityId);
      Datatype source = this.datatypeService.findById(target.getOrigin());
      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), source.getExt(), source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), target.getExt(), target.getDescription(), target.getId());

      DatatypeStructureDisplay sourceDisplay = this.datatypeService.convertDomainToStructureDisplay(source, true);
      DatatypeStructureDisplay targetDisplay = this.datatypeService.convertDomainToStructureDisplay(target, true);
      List<ConformanceStatementDelta> conformanceStatements = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());

      if (target instanceof DateTimeDatatype && source instanceof DateTimeDatatype) {

        List<StructureDelta> structure = entityDeltaService.compareDateAndTimeDatatypes((DateTimeDatatype) source,(DateTimeDatatype) target);
        return new Delta(sourceInfo, targetInfo, structure,conformanceStatements);
      } else {
        List<StructureDelta> structure = entityDeltaService.compareDatatype(sourceDisplay, targetDisplay);
        return new Delta(sourceInfo, targetInfo, structure, conformanceStatements);
      } 


    } else if(type.equals(Type.SEGMENT)) {

      Segment target = this.segmentService.findById(entityId);
      Segment source = this.segmentService.findById(target.getOrigin());

      SegmentStructureDisplay sourceDisplay = this.segmentService.convertDomainToDisplayStructure(source, true);
      SegmentStructureDisplay targetDisplay = this.segmentService.convertDomainToDisplayStructure(target, true);

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), source.getExt(), source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), target.getExt(), target.getDescription(), target.getId());

      List<StructureDelta> structure = entityDeltaService.compareSegment(sourceDisplay, targetDisplay);
      List<ConformanceStatementDelta> conformanceStatements = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());

      Delta ret = new  Delta(sourceInfo, targetInfo, structure, conformanceStatements);
      if(source.getName().toLowerCase().equals("obx")) {

        List<DynamicMappingItemDelta> dynamicMapping = entityDeltaService.compareDynamicMapping(source.getDynamicMappingInfo(), target.getDynamicMappingInfo());
        if(dynamicMapping != null) {
          this.setDynamicMappingDisplay(dynamicMapping);
        }
        ret.setDynamicMapping(dynamicMapping);
      }

      return ret;

    } else if(type.equals(Type.COCONSTRAINTGROUP)) {


      CoConstraintGroup target = this.coConstraintService.findById(entityId);
      CoConstraintGroup source = this.coConstraintService.findById(target.getOrigin());

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), null, source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), null, target.getDescription(), target.getId());

      return new Delta<>(sourceInfo, targetInfo, this.coConstraintDeltaService.deltaGroup(source, target));
    } else if(type.equals(Type.CONFORMANCEPROFILE)) {


      ConformanceProfile target = this.conformanceProfileService.findById(entityId);
      ConformanceProfile source = this.conformanceProfileService.findById(target.getOrigin());

      ConformanceProfileStructureDisplay sourceDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(source, true);
      ConformanceProfileStructureDisplay targetDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(target, true);

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), null, source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), null, target.getDescription(), target.getId());

      List<StructureDelta> structure = entityDeltaService.compareConformanceProfile(sourceDisplay, targetDisplay);
      List<ConformanceStatementDelta> conformanceStatements = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());

      List<CoConstraintBinding> sourceBindings = source.getCoConstraintsBindings() != null ? source.getCoConstraintsBindings() : new ArrayList<>();
      List<CoConstraintBinding> targetBindings = target.getCoConstraintsBindings() != null ? target.getCoConstraintsBindings() : new ArrayList<>();

      this.coConstraintDeltaService.preProcess(sourceBindings);
      this.coConstraintDeltaService.preProcess(targetBindings);


      return new Delta(sourceInfo, targetInfo, structure, conformanceStatements, this.coConstraintDeltaService.delta(sourceBindings, targetBindings));

    } else if(type.equals(Type.COCONSTRAINTBINDINGS)) {

      ConformanceProfile target = this.conformanceProfileService.findById(entityId);
      ConformanceProfile source = this.conformanceProfileService.findById(target.getOrigin());

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), null, source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), null, target.getDescription(), target.getId());

      this.coConstraintDeltaService.preProcess(source.getCoConstraintsBindings());
      this.coConstraintDeltaService.preProcess(target.getCoConstraintsBindings());

      return new Delta(sourceInfo, targetInfo, this.coConstraintDeltaService.delta(source.getCoConstraintsBindings(), target.getCoConstraintsBindings()));

    } else if(type.equals(Type.VALUESET)) {

      Valueset target = this.valuesetService.findById(entityId);
      Valueset source = this.valuesetService.findById(target.getOrigin());

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), null, source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), null, target.getDescription(), target.getId());

      ValuesetDelta valuesetDelta = entityDeltaService.compareValueSet(source, target);

      return new Delta(sourceInfo, targetInfo, valuesetDelta);

    } else if(type.equals(Type.COMPOSITEPROFILE)) {

      CompositeProfileStructure target = this.compositeProfileStructureService.findById(entityId);
      CompositeProfileStructure source = this.compositeProfileStructureService.findById(target.getOrigin());

      DeltaInfo sourceInfo = new DeltaInfo(new SourceDocument(sourceIg.getId(), sourceIg.getMetadata().getTitle(), sourceIg.getDomainInfo().getScope()), source.getDomainInfo(), source.getLabel(), null, source.getDescription(), source.getId());
      DeltaInfo targetInfo = new DeltaInfo(new SourceDocument(targetIg.getId(), targetIg.getMetadata().getTitle(), targetIg.getDomainInfo().getScope()), target.getDomainInfo(), target.getLabel(), null, target.getDescription(), target.getId());
      CompositeProfileDelta delta = this.calculateCompositeProfileDelta(target);
      CompositeProfileDeltaDisplay display = convertToDisplay(delta, target);
      return new Delta(sourceInfo, targetInfo, display);

    }

    return null;
  }



  /**
   * @param dynamicMapping
   */
  private void setDynamicMappingDisplay(List<DynamicMappingItemDelta> dynamicMappingList) {
    for(DynamicMappingItemDelta elm : dynamicMappingList) {
      if(elm.getFlavorId()!=null) {
        elm.setDisplay(new DeltaNode<DisplayElement>());
        if(elm.getFlavorId().getPrevious() != null) {
          Datatype d = datatypeService.findById(elm.getFlavorId().getPrevious());
          if(d != null) {
             elm.getDisplay().setPrevious(displayInfoService.convertDatatype(d));
          }
        }
        if(elm.getFlavorId().getCurrent() != null) {
          Datatype d = datatypeService.findById(elm.getFlavorId().getCurrent());
          if(d != null) {
             elm.getDisplay().setCurrent(displayInfoService.convertDatatype(d));
          }
        }
      }
    }   
    
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

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.delta.service.DeltaService#delta(gov.nist.hit.hl7.igamt.ig.domain.Ig, gov.nist.hit.hl7.igamt.ig.domain.Ig)
   */
  @Override
  public IGDisplayInfo delta(Ig ig, Ig origin) throws IGDeltaException {

    IGDisplayInfo ret = new IGDisplayInfo();
    ret.setIg(ig);
    ret.setMessages(compareRegistries(ig.getConformanceProfileRegistry(), origin.getConformanceProfileRegistry(), Type.CONFORMANCEPROFILEREGISTRY));
    ret.setSegments(compareRegistries(ig.getSegmentRegistry(), origin.getSegmentRegistry(), Type.SEGMENTREGISTRY));
    ret.setDatatypes(compareRegistries(ig.getDatatypeRegistry(), origin.getDatatypeRegistry(), Type.DATATYPEREGISTRY));
    ret.setValueSets(compareRegistries(ig.getValueSetRegistry(), origin.getValueSetRegistry(), Type.VALUESETREGISTRY));
    //ret.setCoConstraintGroups(compareRegistries(ig.getCoConstraintGroupRegistry(), origin.getCoConstraintGroupRegistry(), Type.COCONSTRAINTGROUP));

    ret.setProfileComponents(compareRegistries(ig.getProfileComponentRegistry(), origin.getProfileComponentRegistry(), Type.PROFILECOMPONENTREGISTRY));
    ret.setCompositeProfiles(compareRegistries(ig.getCompositeProfileRegistry(), origin.getCompositeProfileRegistry(), Type.COMPOSITEPROFILEREGISTRY));


    return ret;

  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.delta.service.DeltaService#delta(gov.nist.hit.hl7.igamt.common.base.domain.Type, java.lang.String)
   */
  @Override
  public List<StructureDelta> delta(Type type, String entityId) throws IGDeltaException {
    // TODO Auto-generated method stub
    if(type.equals(Type.DATATYPE)) {

      Datatype target = this.datatypeService.findById(entityId);
      Datatype source = this.datatypeService.findById(target.getOrigin());

      DatatypeStructureDisplay sourceDisplay = this.datatypeService.convertDomainToStructureDisplay(source, true);
      DatatypeStructureDisplay targetDisplay = this.datatypeService.convertDomainToStructureDisplay(target, true);
      List<StructureDelta> structure = entityDeltaService.compareDatatype(sourceDisplay, targetDisplay);
      return structure;

    } else if(type.equals(Type.SEGMENT)) {

      Segment target = this.segmentService.findById(entityId);
      Segment source = this.segmentService.findById(target.getOrigin());

      SegmentStructureDisplay sourceDisplay = this.segmentService.convertDomainToDisplayStructure(source, true);
      SegmentStructureDisplay targetDisplay = this.segmentService.convertDomainToDisplayStructure(target, true);
      List<StructureDelta> structure = entityDeltaService.compareSegment(sourceDisplay, targetDisplay);

      return structure;

    } else if(type.equals(Type.CONFORMANCEPROFILE)) {

      ConformanceProfile target = this.conformanceProfileService.findById(entityId);
      ConformanceProfile source = this.conformanceProfileService.findById(target.getOrigin());

      ConformanceProfileStructureDisplay sourceDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(source, true);
      ConformanceProfileStructureDisplay targetDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(target, true);

      List<StructureDelta> structure = entityDeltaService.compareConformanceProfile(sourceDisplay, targetDisplay);
      return structure;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.delta.service.DeltaService#hasChanged(java.util.List)
   */
  @Override
  public DeltaAction summarize(List<StructureDelta> deltaStructure, List<ConformanceStatementDelta> cfs, List<CoConstraintBinding> coConstraintBindings) {
    // TODO Auto-generated method stub
    DeltaAction ret = DeltaAction.UNCHANGED;
    if(deltaStructure !=null)
      for(StructureDelta child: deltaStructure ) {
        if(child.getData() !=null && child.getData().getAction() != DeltaAction.UNCHANGED) {
          return DeltaAction.UPDATED;
        }
      }
    for(ConformanceStatementDelta child: cfs ) {
      if( child.getAction() != DeltaAction.UNCHANGED) {
        return DeltaAction.UPDATED;
      }
    }
    if(coConstraintBindings != null){
      for(CoConstraintBinding coConstraintBinding: coConstraintBindings ) {
        if( coConstraintBinding.getDelta() != DeltaAction.UNCHANGED) {
          return DeltaAction.UPDATED;
        }
      }
    }
    return ret;
  }

  public Set<DisplayElement> compareRegistries(Registry reg, Registry origin, Type registryType){
    Set<DisplayElement> result = new HashSet<DisplayElement>();
    Map<String, Link> originMap = origin.getLinksAsMap();
    Map<String, Link> regMap = reg.getLinksAsMap();

    Map<String, Link> hasChild = new HashMap<String, Link>();

    for(Link l: reg.getChildren()) {
      if(l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        if(l.getOrigin() == null || !originMap.containsKey(l.getOrigin()) ) {
          result.add(createDeltaDisplay(registryType, l, DeltaAction.ADDED));
        }else if(l.getOrigin()!=null && originMap.containsKey(l.getOrigin())) {

          result.add(compareToOrigin(l, registryType));
          hasChild.put(l.getOrigin(), l);
        }
      } else {
        if(originMap.containsKey(l.getId())) {
          result.add(createDeltaDisplay(registryType, l, DeltaAction.UNCHANGED));
        }else {
          result.add(createDeltaDisplay(registryType, l, DeltaAction.ADDED));
        }
      }
    }
    for(Link l: origin.getChildren()) {
      if(l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        if(!hasChild.containsKey(l.getId())) {
          result.add(createDeltaDisplay(registryType, l, DeltaAction.DELETED));
        }
      }else {
        if(!regMap.containsKey(l.getId())) {
          result.add(createDeltaDisplay(registryType, l, DeltaAction.DELETED));
        }
      }
    }
    return result;

  }

  /**
   * @param l
   * @param registryType
   */
  private DisplayElement compareToOrigin(Link l, Type registryType) {
    // TODO Auto-generated method stub
    switch(registryType) {
      case CONFORMANCEPROFILEREGISTRY: {

        ConformanceProfile target = this.conformanceProfileService.findById(l.getId());
        ConformanceProfile source = this.conformanceProfileService.findById(target.getOrigin());
        DisplayElement elm= this.displayInfoService.convertConformanceProfile(target,l.getPosition());
        DeltaAction action = this.getDeltaSymmaries(target, source);
        elm.setDelta(action);
        return elm;

      }
      case DATATYPEREGISTRY: {
        Datatype target = this.datatypeService.findById(l.getId());
        Datatype source = this.datatypeService.findById(target.getOrigin());

        DatatypeStructureDisplay sourceDisplay = this.datatypeService.convertDomainToStructureDisplay(source, true);
        DatatypeStructureDisplay targetDisplay = this.datatypeService.convertDomainToStructureDisplay(target, true);
        List<StructureDelta> structure = new ArrayList<StructureDelta>();
        if (target instanceof DateTimeDatatype && source instanceof DateTimeDatatype) {
          structure = entityDeltaService.compareDateAndTimeDatatypes((DateTimeDatatype) source,(DateTimeDatatype) target);
        }else {
          structure = entityDeltaService.compareDatatype(sourceDisplay, targetDisplay);
        }
        List<ConformanceStatementDelta> cfs = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());
        DisplayElement elm= this.displayInfoService.convertDatatype(target);
        elm.setDelta(summarize(structure, cfs, null));
        return elm;
      }
      case SEGMENTREGISTRY : {


        Segment target = this.segmentService.findById(l.getId());
        Segment source = this.segmentService.findById(target.getOrigin());

        SegmentStructureDisplay sourceDisplay = this.segmentService.convertDomainToDisplayStructure(source, true);
        SegmentStructureDisplay targetDisplay = this.segmentService.convertDomainToDisplayStructure(target, true);
        List<StructureDelta> structure = entityDeltaService.compareSegment(sourceDisplay, targetDisplay);
        DisplayElement elm= this.displayInfoService.convertSegment(target);
        List<ConformanceStatementDelta> cfs = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());
        elm.setDelta(summarize(structure,cfs, null));
        if(target.getName().equalsIgnoreCase("OBX") && elm.getDelta().equals(DeltaAction.UNCHANGED)) {
          List<DynamicMappingItemDelta> dynamicMappingDelta = entityDeltaService.compareDynamicMapping(source.getDynamicMappingInfo(), target.getDynamicMappingInfo());
          for(DynamicMappingItemDelta dyn: dynamicMappingDelta) {
            if(dyn.getAction() != null && !dyn.getAction().equals(DeltaAction.UNCHANGED)) {
              elm.setDelta(DeltaAction.UPDATED);
              break;
            }
          }
        }
        return elm;
      }
      case VALUESETREGISTRY: {

        Valueset target = this.valuesetService.findById(l.getId());
        Valueset source = this.valuesetService.findById(target.getOrigin());

        DisplayElement elm= this.displayInfoService.convertValueSet(target);

        ValuesetDelta valuesetDelta = entityDeltaService.compareValueSetMetadata(source, target);

        if(valuesetDelta.getAction() !=null && !valuesetDelta.getAction().equals(DeltaAction.UPDATED)) {
          List<CodeDelta> codeDeltas = entityDeltaService.compareCodes(source.getCodes(), target.getCodes());
          valuesetDelta.setCodes(codeDeltas);
        }
        elm.setDelta(valuesetDelta.getAction());
        return elm;
      }
      case PROFILECOMPONENTREGISTRY: {

        ProfileComponent target = this.profileComponentService.findById(l.getId());

        DisplayElement elm= this.displayInfoService.convertProfileComponent(target, l.getPosition());

        if(target.isDerived()) {
          elm.setDelta(DeltaAction.UNCHANGED);
        }else {
          elm.setDelta(DeltaAction.ADDED);
        }
        return elm;
      } 
      case COMPOSITEPROFILEREGISTRY: {


        CompositeProfileStructure target = this.compositeProfileStructureService.findById(l.getId());
        CompositeProfileStructure source = this.compositeProfileStructureService.findById(target.getOrigin());
        ConformanceProfile cpTarget = this.conformanceProfileService.findById(target.getConformanceProfileId());
        ConformanceProfile cpSource = this.conformanceProfileService.findById(source.getConformanceProfileId());
        DeltaAction profileAction = this.getDeltaSymmaries(cpTarget, cpSource);

        DisplayElement elm= this.displayInfoService.convertCompositeProfile(target, l.getPosition());
        if(!profileAction.equals(DeltaAction.UNCHANGED)) {
          elm.setDelta(profileAction);
        }else {
          List<ProfileComponentLinkDelta> children = entityDeltaService.compareProfileComponents(target.getOrderedProfileComponents(), source.getOrderedProfileComponents());
          for(ProfileComponentLinkDelta delta: children) {
            if(!delta.getDelta().equals(DeltaAction.UNCHANGED)) {
              elm.setDelta(DeltaAction.UPDATED);
              break;
            }
          }
        }

        return elm;
      } 
      default:  return null;
    }
  }

  /**
   * @param target
   * @param source
   * @return
   */
  private DeltaAction getDeltaSymmaries(ConformanceProfile target, ConformanceProfile source) {

    ConformanceProfileStructureDisplay sourceDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(source, true);
    ConformanceProfileStructureDisplay targetDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(target, true);
    List<ConformanceStatementDelta> cfs = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());
    List<StructureDelta> structure = entityDeltaService.compareConformanceProfile(sourceDisplay, targetDisplay);

    List<CoConstraintBinding> sourceBindings = source.getCoConstraintsBindings() != null ? source.getCoConstraintsBindings() : new ArrayList<>();
    List<CoConstraintBinding> targetBindings = target.getCoConstraintsBindings() != null ? target.getCoConstraintsBindings() : new ArrayList<>();

    this.coConstraintDeltaService.preProcess(sourceBindings);
    this.coConstraintDeltaService.preProcess(targetBindings);
    List<CoConstraintBinding> bindings = this.coConstraintDeltaService.delta(sourceBindings, targetBindings);
    return summarize(structure,cfs,bindings);
  }

  /**
   * @param registryType
   * @param l
   * @param deleted
   */
  private DisplayElement createDeltaDisplay(Type registryType, Link l, DeltaAction action) {
    // TODO Auto-generated method stub
    switch(registryType) {
      case CONFORMANCEPROFILEREGISTRY: {

        ConformanceProfile target = this.conformanceProfileService.findById(l.getId());
        DisplayElement elm= this.displayInfoService.convertConformanceProfile(target,l.getPosition());
        elm.setDelta(action);
        return elm;

      }
      case DATATYPEREGISTRY: {
        Datatype target = this.datatypeService.findById(l.getId());
        DisplayElement elm= this.displayInfoService.convertDatatype(target);
        elm.setDelta(action);
        return elm;
      }
      case SEGMENTREGISTRY : {

        Segment target = this.segmentService.findById(l.getId());
        DisplayElement elm= this.displayInfoService.convertSegment(target);
        elm.setDelta(action);
        return elm;
      }
      case VALUESETREGISTRY: {

        Valueset vs =  this.valuesetService.findById(l.getId()); 
        DisplayElement elm= displayInfoService.convertValueSet(vs);
        elm.setDelta(action);

        return elm;
      }
      case PROFILECOMPONENTREGISTRY: {

        ProfileComponent pc =  this.profileComponentService.findById(l.getId()); 
        DisplayElement elm= displayInfoService.convertProfileComponent(pc, l.getPosition());
        elm.setDelta(action);

        return elm;
      }
      case COMPOSITEPROFILEREGISTRY: {

        CompositeProfileStructure cp =  this.compositeProfileStructureService.findById(l.getId());
        DisplayElement elm= displayInfoService.convertCompositeProfile(cp, l.getPosition());
        elm.setDelta(action);
        return elm;
      }
      default:  return null;
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.delta.service.DeltaService#delta(gov.nist.hit.hl7.igamt.common.base.domain.Type, gov.nist.hit.hl7.igamt.common.base.domain.Resource)
   */
  @Override
  public ResourceDelta delta(Type type, Resource resource){
    // TODO Auto-generated method stub
    if(type.equals(Type.DATATYPE)) {
      Datatype target = (Datatype) resource;
      Datatype source = this.datatypeService.findById(target.getOrigin());
      DatatypeStructureDisplay sourceDisplay = this.datatypeService.convertDomainToStructureDisplay(source, true);
      DatatypeStructureDisplay targetDisplay = this.datatypeService.convertDomainToStructureDisplay(target, true);
      List<StructureDelta> structure = entityDeltaService.compareDatatype(sourceDisplay, targetDisplay);
      List<ConformanceStatementDelta> conformanceStatements = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());
      ResourceDelta rd = new ResourceDelta();
      rd.setStructureDelta(structure);
      rd.setConformanceStatementDelta(conformanceStatements);
      return rd;

    } else if(type.equals(Type.SEGMENT)) {
      Segment target = (Segment) resource;
      Segment source = this.segmentService.findById(target.getOrigin());
      SegmentStructureDisplay sourceDisplay = this.segmentService.convertDomainToDisplayStructure(source, true);
      SegmentStructureDisplay targetDisplay = this.segmentService.convertDomainToDisplayStructure(target, true);
      List<StructureDelta> structure = entityDeltaService.compareSegment(sourceDisplay, targetDisplay);

      List<ConformanceStatementDelta> conformanceStatements = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());

      ResourceDelta rd = new ResourceDelta();
      rd.setStructureDelta(structure);
      rd.setConformanceStatementDelta(conformanceStatements);
      return rd;

    } else if(type.equals(Type.CONFORMANCEPROFILE)) {
      ConformanceProfile target = (ConformanceProfile) resource;
      ConformanceProfile source = this.conformanceProfileService.findById(target.getOrigin());

      ConformanceProfileStructureDisplay sourceDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(source, true);
      ConformanceProfileStructureDisplay targetDisplay = this.conformanceProfileService.convertDomainToDisplayStructure(target, true);

      List<StructureDelta> structure = entityDeltaService.compareConformanceProfile(sourceDisplay, targetDisplay);
      List<ConformanceStatementDelta> conformanceStatements = entityDeltaService.compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());

      List<CoConstraintBinding> sourceBindings = source.getCoConstraintsBindings() != null ? source.getCoConstraintsBindings() : new ArrayList<>();
      List<CoConstraintBinding> targetBindings = target.getCoConstraintsBindings() != null ? target.getCoConstraintsBindings() : new ArrayList<>();

      this.coConstraintDeltaService.preProcess(sourceBindings);
      this.coConstraintDeltaService.preProcess(targetBindings);
      List<CoConstraintBinding> bindings = this.coConstraintDeltaService.delta(sourceBindings, targetBindings);

      ResourceDelta rd = new ResourceDelta();
      rd.setStructureDelta(structure);
      rd.setConformanceStatementDelta(conformanceStatements);
      rd.setCoConstraintBindings(bindings);
      return rd;

    }
    return null;
  }

  @Override
  public ValuesetDelta valuesetDelta(Valueset valueset) {
    Valueset source = this.valuesetService.findById(valueset.getOrigin());
    ValuesetDelta vsDelta = entityDeltaService.compareValueSet(source, valueset);
    return vsDelta;
  }


  public CompositeProfileDelta calculateCompositeProfileDelta(CompositeProfileStructure target) {
    CompositeProfileDelta delta = new CompositeProfileDelta();
    CompositeProfileStructure source = this.compositeProfileStructureService.findById(target.getOrigin());
    ConformanceProfile cpTarget = this.conformanceProfileService.findById(target.getConformanceProfileId());
    ConformanceProfile cpSource = this.conformanceProfileService.findById(source.getConformanceProfileId());
    DeltaAction profileAction = this.getDeltaSymmaries(cpTarget, cpSource);
    List<ProfileComponentLinkDelta> children = entityDeltaService.compareProfileComponents(source.getOrderedProfileComponents(), target.getOrderedProfileComponents());
    delta.setChildren(children);
    if(!profileAction.equals(DeltaAction.UNCHANGED)) {
      delta.setAction(profileAction);
    } else {
      for(ProfileComponentLinkDelta child: children) {
        if(!child.getDelta().equals(DeltaAction.UNCHANGED)) {
          delta.setAction(DeltaAction.UPDATED);
          break;
        }
      }
    }
    return delta; 
  }

  /**
   * @param delta
   * @return
   */
  private CompositeProfileDeltaDisplay convertToDisplay(CompositeProfileDelta delta, CompositeProfileStructure composite) {
    CompositeProfileDeltaDisplay ret = new CompositeProfileDeltaDisplay();
    ret.setAction(delta.getAction());
    DisplayElement elm= this.displayInfoService.convertCompositeProfile(composite, 0);
    ret.setCompositeDisplay(elm);
    List<ProfileComponentLinkDeltaDisplay> children = new ArrayList<ProfileComponentLinkDeltaDisplay>();
    ConformanceProfile cpTarget = this.conformanceProfileService.findById(composite.getConformanceProfileId());
    if(cpTarget != null) {
      DisplayElement profileElement= this.displayInfoService.convertConformanceProfile(cpTarget, 0);
      profileElement.setDelta(delta.getAction());
      ret.setCoreProfileDisplay(profileElement);
    }

    if(delta.getChildren() != null) {
      for (ProfileComponentLinkDelta node : delta.getChildren() ) {
        children.add(this.convertProfileComponentDeltaToDisplay(node));
      }
      ret.setChildren(children);
    }
    return ret;
  }



  /**
   * @param node
   * @return
   */
  private ProfileComponentLinkDeltaDisplay convertProfileComponentDeltaToDisplay(
      ProfileComponentLinkDelta node) {
    ProfileComponentLinkDeltaDisplay ret = new ProfileComponentLinkDeltaDisplay();
    ret.setPosition(node.getPosition());
    ret.setDelta(node.getDelta());
    ret.setDisplay(new DeltaNode<DisplayElement>());
    ret.getDisplay().setAction(node.getDelta());
    if(node.getNode() != null) {
      if(node.getNode().getCurrent() != null) {
        ProfileComponent current =  this.profileComponentService.findById(node.getNode().getCurrent());
        if(current != null) {
          ret.getDisplay().setCurrent(displayInfoService.convertProfileComponent(current, 0));
        }
      }
      if(node.getNode().getPrevious() != null) {
        ProfileComponent previous =  this.profileComponentService.findById(node.getNode().getPrevious());
        if(previous != null) {
          ret.getDisplay().setPrevious(displayInfoService.convertProfileComponent(previous, 0));
        }
      }
    }
    return ret;
  }


}

