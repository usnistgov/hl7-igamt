package gov.nist.hit.hl7.igamt.delta.service;

import com.google.common.base.Strings;
import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.binding.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.*;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.*;
import gov.nist.hit.hl7.igamt.delta.domain.*;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldStructureTreeModel;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class EntityDeltaServiceImpl {


  @Autowired
  ValuesetService valueSetService;


  public List<StructureDelta> compareDatatype(DatatypeStructureDisplay source, DatatypeStructureDisplay target) {
    return new ArrayList<>(this.compareComponents(source.getStructure(), target.getStructure()));
  }

  public List<StructureDelta> compareSegment(SegmentStructureDisplay source, SegmentStructureDisplay target) {
    return new ArrayList<>(this.compareFields(source.getStructure(), target.getStructure()));
  }

  public  List<ConformanceStatementDelta> compareConformanceStatements(Set<ConformanceStatement> source, Set<ConformanceStatement> target) {
    List<ConformanceStatementDelta> deltas = new ArrayList<>();
    Map<String, ConformanceStatement> sourceMap = source != null ? source.stream().collect(Collectors.toMap(ConformanceStatement::getId, x-> x)) : new HashMap<>();
    Map<String, ConformanceStatement> targetMap = target != null ? target.stream().collect(Collectors.toMap(ConformanceStatement::getId, x-> x)) : new HashMap<>();

    sourceMap.values().forEach((st) -> {
      ConformanceStatementDelta structureDelta = new ConformanceStatementDelta();
      if(targetMap.containsKey(st.getId())) {
        this.compare(structureDelta, st, targetMap.get(st.getId()));
      } else {
        structureDelta.setDescription(new DeltaNode<>(st.generateDescription(), null, DeltaAction.DELETED));
        structureDelta.setIdentifier(new DeltaNode<>(st.getIdentifier(), null, DeltaAction.DELETED));
        structureDelta.setAction(DeltaAction.DELETED);
        deltas.add(structureDelta);
      }
    });

    targetMap.values().forEach((st) -> {
      ConformanceStatementDelta structureDelta = new ConformanceStatementDelta();
      if(!sourceMap.containsKey(st.getId())) {
        structureDelta.setDescription(new DeltaNode<>( null,st.generateDescription(), DeltaAction.ADDED));
        structureDelta.setIdentifier(new DeltaNode<>( null,st.getIdentifier(), DeltaAction.ADDED));
        structureDelta.setAction(DeltaAction.ADDED);
        deltas.add(structureDelta);
      }
    });

    return deltas;
  }

  public ValuesetDelta compareValueSet(Valueset source, Valueset target) {
    ValuesetDelta valuesetDelta = this.compareValueSetMetadata(source, target);
    List<CodeDelta> codeDeltas = this.compareCodes(source.getCodes(), target.getCodes());
    valuesetDelta.setCodes(codeDeltas);
    return valuesetDelta;
  }

  public List<StructureDelta> compareConformanceProfile(ConformanceProfileStructureDisplay source, ConformanceProfileStructureDisplay target) {
    return this.compareSegOrGroups(source.getStructure(), target.getStructure());
  }

  private <T> List<StructureDelta> compareSubComponents(Set<SubComponentStructureTreeModel> source, Set<SubComponentStructureTreeModel> target) {
    List<StructureDelta> deltas = new ArrayList<>();

    Map<Integer, List<SubComponentStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<SubComponentStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    Map<Integer, List<SubComponentStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<SubComponentStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    this.compareChildren(sourceChildren, targetChildren, this::compareSubComponent);
    return deltas;
  }

  private <T> List<StructureDelta> compareChildren(Map<Integer, List<T>> source, Map<Integer, List<T>> target, CompareFn<T> compare) {
    List<StructureDelta> deltas = new ArrayList<>();

    source.forEach((key, value) -> {
      StructureDelta structureDelta = new StructureDelta();
      if (target.containsKey(key)) {
        compare.compare(structureDelta, value.get(0), target.get(key).get(0));
        target.remove(key);
      } else {
        compare.compare(structureDelta, value.get(0), value.get(0));
        structureDelta.setAction(DeltaAction.DELETED);
      }
      deltas.add(structureDelta);
    });


    target.forEach((key, value) -> {
      StructureDelta structureDelta = new StructureDelta();
      compare.compare(structureDelta, value.get(0), value.get(0));
      structureDelta.setAction(DeltaAction.ADDED);
      deltas.add(structureDelta);
    });

    return deltas;
  }

  private List<StructureDelta> compareComponents(Set<ComponentStructureTreeModel> source, Set<ComponentStructureTreeModel> target) {
    List<StructureDelta> deltas = new ArrayList<>();
    Map<Integer, List<ComponentStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<ComponentStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    Map<Integer, List<ComponentStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<ComponentStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    this.compareChildren(sourceChildren, targetChildren, this::compare);
    return deltas;
  }

  private List<StructureDelta> compareFields(Set<FieldStructureTreeModel> source, Set<FieldStructureTreeModel> target) {
    List<StructureDelta> deltas = new ArrayList<>();
    Map<Integer, List<FieldStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<FieldStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    Map<Integer, List<FieldStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<FieldStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    this.compareChildren(sourceChildren, targetChildren, this::compare);
    return deltas;
  }

  private int getPosition(SegmentRefOrGroupStructureTreeModel e) {
    if(e instanceof SegmentRefStructureTreeModel) {
      return ((SegmentRefStructureTreeModel) e).getData().getPosition();
    } else if(e instanceof GroupStructureTreeModel) {
      return ((GroupStructureTreeModel) e).getData().getPosition();
    }
    return -1;
  }

  private List<StructureDelta> compareSegOrGroups(Set<SegmentRefOrGroupStructureTreeModel> source, Set<SegmentRefOrGroupStructureTreeModel> target) {
    List<StructureDelta> deltas = new ArrayList<>();
    Map<Integer, List<SegmentRefOrGroupStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<SegmentRefOrGroupStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy(this::getPosition));
    Map<Integer, List<SegmentRefOrGroupStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<SegmentRefOrGroupStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy(this::getPosition));
    this.compareChildren(sourceChildren, targetChildren, this::compare);
    return deltas;
  }


  public ValuesetDelta compareValueSetMetadata(Valueset source, Valueset target) {
    ValuesetDelta delta = new ValuesetDelta();
    delta.setAction(DeltaAction.UNCHANGED);
    DeltaNode<Stability> stability = this.compare(source.getStability(), target.getStability());
    DeltaNode<Extensibility> extensibility = this.compare(source.getExtensibility(), target.getExtensibility());
    DeltaNode<ContentDefinition> contentDefinition = this.compare(source.getContentDefinition(), target.getContentDefinition());

    delta.setStability(stability);
    delta.setExtensibility(extensibility);
    delta.setContentDefinition(contentDefinition);
    return delta;
  }

  public List<CodeDelta> compareCodes(Set<Code> source, Set<Code> target) {
    List<CodeDelta> deltas = new ArrayList<>();
    Map<String, List<Code>> sourceChildren = (source != null ? source : new HashSet<Code>()).stream()
        .collect(Collectors.groupingBy(Code::getValue));
    Map<String, List<Code>> targetChildren = (target != null ? target : new HashSet<Code>()).stream()
        .collect(Collectors.groupingBy(Code::getValue));

    for(Map.Entry<String, List<Code>> entry: sourceChildren.entrySet()) {
      CodeDelta codeDelta = new CodeDelta();
      codeDelta.setAction(DeltaAction.UNCHANGED);
      if(targetChildren.containsKey(entry.getKey())) {
        this.compare(codeDelta, entry.getValue().get(0), targetChildren.get(entry.getKey()).get(0));
        targetChildren.remove(entry.getKey());
      } else {
        this.compare(codeDelta, entry.getValue().get(0), entry.getValue().get(0));
        codeDelta.setAction(DeltaAction.DELETED);
      }

      deltas.add(codeDelta);
    }

    for(Map.Entry<String, List<Code>> entry: targetChildren.entrySet()) {
      CodeDelta codeDelta = new CodeDelta();
      codeDelta.setAction(DeltaAction.UNCHANGED);
      this.compare(codeDelta, entry.getValue().get(0), entry.getValue().get(0));
      codeDelta.setAction(DeltaAction.ADDED);
      deltas.add(codeDelta);
    }

    return deltas;
  }

  private ReferenceDelta compareDatatypeRef(DatatypeLabel source, DatatypeLabel target) {
    ReferenceDelta ref = new ReferenceDelta();
    ref.setDomainInfo(this.compare(source.getDomainInfo(), target.getDomainInfo()));
    ref.setId(this.compare(source.getId(), target.getId()));
    ref.setLabel(this.compare(source.getLabel(), target.getLabel()));
    ref.setType(Type.DATATYPE);
    return ref;
  }

  private void compareSubComponent(StructureDelta structure, SubComponentStructureTreeModel source, SubComponentStructureTreeModel target) {
    ReferenceDelta ref = this.compareDatatypeRef(source.getData().getDatatypeLabel(), target.getData().getDatatypeLabel());
    structure.setType(source.getData().getType());
    structure.setReference(ref);
    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());
    this.compare(structure, (Component) source.getData(), (Component) target.getData());
  }

  private void compare(StructureDelta structure, ComponentStructureTreeModel source,  ComponentStructureTreeModel target) {
    ReferenceDelta ref = this.compareDatatypeRef(source.getData().getDatatypeLabel(), target.getData().getDatatypeLabel());
    structure.setType(source.getData().getType());
    structure.setReference(ref);
    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());
    this.compare(structure, (Component) source.getData(), (Component) target.getData());
    structure.setChildren(this.compareSubComponents(source.getChildren(), target.getChildren()));
  }

  private void compare(StructureDelta structure, FieldStructureTreeModel source, FieldStructureTreeModel target) {
    ReferenceDelta ref = this.compareDatatypeRef(source.getData().getDatatypeLabel(), target.getData().getDatatypeLabel());
    structure.setType(source.getData().getType());
    structure.setReference(ref);
    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());
    this.compare(structure, (Field) source.getData(), (Field) target.getData());
    structure.setChildren(this.compareComponents(source.getChildren(), target.getChildren()));
  }

  private void compare(ConformanceStatementDelta delta, ConformanceStatement source, ConformanceStatement target) {
    delta.setAction(DeltaAction.UNCHANGED);
    delta.setDescription(this.compare(source.generateDescription(), target.generateDescription()));
    delta.setIdentifier(this.compare(source.getIdentifier(), target.getIdentifier()));
  }

  private void compare(StructureDelta structure, SegmentRefOrGroupStructureTreeModel source, SegmentRefOrGroupStructureTreeModel target) {
    if(source instanceof SegmentRefStructureTreeModel) {
      this.compare(structure, (SegmentRefStructureTreeModel) source, (SegmentRefStructureTreeModel) target);
    } else if(source instanceof GroupStructureTreeModel) {
      this.compare(structure, (GroupStructureTreeModel) source, (GroupStructureTreeModel) target);
    }
  }

  private void compare(StructureDelta structure, SegmentRefStructureTreeModel source, SegmentRefStructureTreeModel target) {
    ReferenceDelta ref = new ReferenceDelta();
    structure.setType(source.getData().getType());
    ref.setDomainInfo(this.compare(source.getData().getSegmentLabel().getDomainInfo(), target.getData().getSegmentLabel().getDomainInfo()));
    ref.setId(this.compare(source.getData().getSegmentLabel().getId(), target.getData().getSegmentLabel().getId()));
    ref.setLabel(this.compare(source.getData().getSegmentLabel().getLabel(), target.getData().getSegmentLabel().getLabel()));
    ref.setType(Type.SEGMENT);
    structure.setReference(ref);


    this.compare(structure, (MsgStructElement) source.getData(), (MsgStructElement) target.getData());
    structure.setChildren(this.compareFields(source.getChildren(), target.getChildren()));
  }

  private void compare(StructureDelta structure, GroupStructureTreeModel source, GroupStructureTreeModel target) {
    structure.setType(source.getData().getType());

    this.compare(structure, (MsgStructElement) source.getData(), (MsgStructElement) target.getData());
    structure.setChildren(this.compareSegOrGroups(source.getChildren(), target.getChildren()));
  }


  private void compare(StructureDelta structure, Component source, Component target) {
    structure.setConstantValue(this.compare(source.getConstantValue(), target.getConstantValue()));
    this.compare(structure, (SubStructElement) source, (SubStructElement) target);
  }

  private void compare(StructureDelta structure, Field source, Field target) {
    structure.setConstantValue(this.compare(source.getConstantValue(), target.getConstantValue()));
    structure.setMinCardinality(this.compare(source.getMin(), target.getMin()));
    structure.setMaxCardinality(this.compare(source.getMax(), target.getMax()));
    this.compare(structure, (SubStructElement) source, (SubStructElement) target);
  }

  private void compare(StructureDelta structure, MsgStructElement source, MsgStructElement target) {
    structure.setMinCardinality(this.compare(source.getMin(), target.getMin()));
    structure.setMaxCardinality(this.compare(source.getMax(), target.getMax()));
    this.compare(structure, (StructureElement) source, (StructureElement) target);
  }

  private void compare(StructureDelta structure, SubStructElement source, SubStructElement target) {
    structure.setMaxLength(this.compare(source.getMaxLength(), target.getMaxLength()));
    structure.setMinLength(this.compare(source.getMinLength(), target.getMinLength()));
    structure.setConfLength(this.compare(source.getConfLength(), target.getConfLength()));
    this.compare(structure, (StructureElement) source, (StructureElement) target);
  }

  private void compare(StructureDelta structure, StructureElement source, StructureElement target) {
    structure.setUsage(this.compare(source.getUsage(), target.getUsage()));
    structure.setName(this.compare(source.getName(), target.getName()));
    structure.setDefinition(this.compare(source.getText(), target.getText()));
    structure.setPosition(source.getPosition());
  }

  private void compare(CodeDelta structure, Code source, Code target) {
    structure.setUsage(this.compare(source.getUsage(), target.getUsage()));
    structure.setValue(this.compare(source.getValue(), target.getValue()));
    structure.setCodeSystem(this.compare(source.getCodeSystem(), target.getCodeSystem()));
    structure.setCodeSystemOid(this.compare(source.getCodeSystemOid(), target.getCodeSystemOid()));
    structure.setDescription(this.compare(source.getDescription(), target.getDescription()));
    structure.setComments(this.compare(source.getComments(), target.getComments()));
  }


  private DeltaNode<DomainInfo> compare(DomainInfo source, DomainInfo target) {
    return this.compare(source, target, (s, t) -> s.getVersion().equals(t.getVersion()) && s.getScope().equals(t.getScope()));
  }

  private DeltaNode<String> compare(String source, String target) {
    return this.compare(source, target, (elm) -> elm != null && !elm.equals("NA") && !elm.equals(""), String::equals);
  }

  private DeltaNode<Usage> compare(Usage source, Usage target) {
    return this.compare(source, target, Enum::equals);
  }

  private DeltaNode<List<String>> compare(List<String> source, List<String> target) {
    return this.compare(source, target, List::equals);
  }

  private DeltaNode<CodeUsage> compare(CodeUsage source, CodeUsage target) {
    return this.compare(source, target, Enum::equals);
  }

  private DeltaNode<Integer> compare(int source, int target) {
    return this.compare(source, target, Integer::equals);
  }

  private <T> DeltaNode<T> compare(T source, T target, BiFunction<T, T, Boolean> f) {
    return this.compare(source, target, Objects::nonNull, f);
  }

  private <T> DeltaNode<T> compare(T source, T target, Function<T, Boolean> valued, BiFunction<T, T, Boolean> equal) {
    DeltaNode<T> node = new DeltaNode<>();
    DeltaAction action = DeltaAction.UNCHANGED;
    if(!valued.apply(source) && valued.apply(target)) {
      action = DeltaAction.ADDED;
    } else if(valued.apply(source) && !valued.apply(target)) {
      action = DeltaAction.DELETED;
    } else if(valued.apply(source) && valued.apply(target)) {
      if(!equal.apply(source, target)) {
        action = DeltaAction.UPDATED;
      }
    }
    node.setAction(action);
    node.setCurrent(target);
    node.setPrevious(source);
    return node;
  }

  private DeltaNode<Stability> compare(Stability source, Stability target) {
    return this.compare(source, target, Enum::equals);
  }

  private DeltaNode<Extensibility> compare(Extensibility source, Extensibility target) {
    return this.compare(source, target, Enum::equals);
  }

  private DeltaNode<ContentDefinition> compare(ContentDefinition source, ContentDefinition target) {
    return this.compare(source, target, Enum::equals);
  }

  private void compareBindings(StructureDelta structure, BindingDisplay source, BindingDisplay target) {
    compareValueSetBinding(structure,  source,  target);
    if(source != null) {
      if(target != null) {
        if(source.getPredicate() == null ) {
          if(target.getPredicate() != null) {
            // predicate added
            structure.setPredicate(this.comparePredicates(new Predicate(), target.getPredicate()));
            structure.getPredicate().setAction(DeltaAction.ADDED);
            structure.setAction(DeltaAction.UPDATED);
          }
        } else {
          if(target.getPredicate() == null) {
            // predicate removed
            structure.setPredicate(this.comparePredicates(source.getPredicate(), new Predicate()));
            structure.getPredicate().setAction(DeltaAction.DELETED);
            structure.setAction(DeltaAction.UPDATED);
          } else {
            // predicate changed
            structure.setPredicate(this.comparePredicates(source.getPredicate(), target.getPredicate()));
          }
        }
      }
    } else {
      if(target != null) {
        if(target.getPredicate() != null) {
          // predicate added
          structure.setPredicate(this.comparePredicates(new Predicate(), target.getPredicate()));
          structure.getPredicate().setAction(DeltaAction.ADDED);
          structure.setAction(DeltaAction.UPDATED);
        }
      }
    }

  }


  private void compareValueSetBinding(StructureDelta structure, BindingDisplay source, BindingDisplay target) {
    if(source !=null && target !=null) {

      if(source.getBindingType().equals(target.getBindingType())) {

        if(source.getBindingType().equals(BindingType.VS)) {
          structure.setValueSetBinding(this.compareValueSetBinding(source.getValuesetBindings(), target.getValuesetBindings()));
        }else if(source.getBindingType().equals(BindingType.SC)){
          structure.setInternalSingleCode(this.compareInternalSingleCodes(source.getInternalSingleCode(), target.getInternalSingleCode()));
        }
      } else {
        if(source.getBindingType().equals(BindingType.VS)) {
          if(target.getBindingType().equals(BindingType.SC)) {

            structure.setValueSetBinding(this.compareValueSetBinding(source.getValuesetBindings(), new HashSet<DisplayValuesetBinding>()));
            structure.setInternalSingleCode(this.compareInternalSingleCodes(new InternalSingleCode(), target.getInternalSingleCode()));
            structure.getValueSetBinding().setAction(DeltaAction.DELETED);
            structure.getInternalSingleCode().setAction(DeltaAction.ADDED); 

          }

        }else if(source.getBindingType().equals(BindingType.SC)){

          if(target.getBindingType().equals(BindingType.VS)) {

            structure.setValueSetBinding(this.compareValueSetBinding(new HashSet<DisplayValuesetBinding>(), target.getValuesetBindings()));
            structure.setInternalSingleCode(this.compareInternalSingleCodes(source.getInternalSingleCode() , target.getInternalSingleCode()));
            structure.getValueSetBinding().setAction(DeltaAction.ADDED);
            structure.getInternalSingleCode().setAction(DeltaAction.DELETED);
          }
        }
      }
    } else if(source == null && target != null){
        if(target.getBindingType().equals(BindingType.VS)){
            structure.setValueSetBinding(this.compareValueSetBinding(new HashSet<DisplayValuesetBinding>(), target.getValuesetBindings()));
            structure.getValueSetBinding().setAction(DeltaAction.ADDED);

        } else if(target.getBindingType().equals(BindingType.SC)){
            structure.setInternalSingleCode(this.compareInternalSingleCodes(new InternalSingleCode() , target.getInternalSingleCode()));
            structure.getInternalSingleCode().setAction(DeltaAction.ADDED);
        }
    }

  }

  public PredicateDelta comparePredicates(Predicate source, Predicate target) {
    PredicateDelta delta = new PredicateDelta();
    delta.setAction(DeltaAction.UNCHANGED);
    DeltaNode<Usage> trueUsage = this.compare(source.getTrueUsage(), target.getTrueUsage());
    delta.setTrueUsage(trueUsage);
    DeltaNode<Usage> falseUsage = this.compare(source.getFalseUsage(), target.getFalseUsage());
    delta.setFalseUsage(falseUsage);
    DeltaNode<String> description = this.compare(source.generateDescription(), target.generateDescription());
    delta.setDescription(description);
    return delta;
  }


  public DisplayElement makeDisplayElementForSingleCode(InternalSingleCode source) {
    if(source != null && !Strings.isNullOrEmpty(source.getValueSetId())) {
      Valueset vs =  this.valueSetService.findById(source.getValueSetId());
      DisplayElement displayElement = new DisplayElement();
      displayElement.setVariableName(vs.getBindingIdentifier());
      displayElement.setId(vs.getId());
      displayElement.setDomainInfo(vs.getDomainInfo());
      return displayElement;
    }

    return null;
  }

  public DeltaInternalSingleCode compareInternalSingleCodes(InternalSingleCode source, InternalSingleCode target) {
    DeltaInternalSingleCode delta = new DeltaInternalSingleCode();
    delta.setAction(DeltaAction.UNCHANGED);

    if(source != null && target != null) {
      DisplayElement vsSourceDisplay = this.makeDisplayElementForSingleCode(source);
      DisplayElement vsTargetDisplay = this.makeDisplayElementForSingleCode(target);

      DeltaNode<DisplayElement> valueSetDisplay = this.compare(vsSourceDisplay, vsTargetDisplay);
      DeltaNode<String> codeSystem = this.compare(source.getCodeSystem(), target.getCodeSystem());
      DeltaNode<String> code = this.compare(source.getCode(), target.getCode());

      delta.setCode(code);
      delta.setValueSetDisplay(valueSetDisplay);
      delta.setCodeSystem(codeSystem);

      return delta;
    }

    if(source != null) {
      // Deleted
      delta.setAction(DeltaAction.DELETED);
      DisplayElement vsSourceDisplay = this.makeDisplayElementForSingleCode(source);

      DeltaNode<DisplayElement> valueSetDisplay = this.compare(vsSourceDisplay, null);
      DeltaNode<String> codeSystem = this.compare(source.getCodeSystem(), null);
      DeltaNode<String> code = this.compare(source.getCode(), null);

      delta.setCode(code);
      delta.setValueSetDisplay(valueSetDisplay);
      delta.setCodeSystem(codeSystem);
      return delta;
    }

    if(target != null) {
      // Added
      delta.setAction(DeltaAction.ADDED);
      DisplayElement vsTargetDisplay = this.makeDisplayElementForSingleCode(target);

      DeltaNode<DisplayElement> valueSetDisplay = this.compare(null, vsTargetDisplay);
      DeltaNode<String> codeSystem = this.compare(null, target.getCodeSystem());
      DeltaNode<String> code = this.compare(null, target.getCode());

      delta.setCode(code);
      delta.setValueSetDisplay(valueSetDisplay);
      delta.setCodeSystem(codeSystem);
      return delta;
    }

    return  delta;
  }


  private DeltaNode<DisplayElement> compare(DisplayElement vsSourceDisplay, DisplayElement vsTargetDisplay) {
    return this.compare(vsSourceDisplay, vsTargetDisplay, (s, t) -> vsSourceDisplay.getVariableName().equals(vsTargetDisplay.getVariableName()));
  }

  public DeltaValuesetBinding compareValueSetBinding(Set<DisplayValuesetBinding> source, Set<DisplayValuesetBinding> target) {
    DeltaValuesetBinding delta = new DeltaValuesetBinding();
    delta.setAction(DeltaAction.UNCHANGED);
    DisplayValuesetBinding sourceBindingDisplay = source != null ? source.stream().findFirst().orElse(null) : null;
    DisplayValuesetBinding targetBindingDisplay = target != null ? target.stream().findFirst().orElse(null) : null;

    if(sourceBindingDisplay != null && targetBindingDisplay != null) {
      DeltaNode<List<DisplayElement>> valueSets = this.compareDisplay(sourceBindingDisplay.getValueSetsDisplay(), targetBindingDisplay.getValueSetsDisplay());
      DeltaNode<ValuesetStrength> strength = this.compare(sourceBindingDisplay.getStrength(), targetBindingDisplay.getStrength());
      DeltaNode<Set<Integer>> valuesetLocations = this.compare(sourceBindingDisplay.getValuesetLocations(), targetBindingDisplay.getValuesetLocations());
      delta.setStrength(strength);
      delta.setValuesetLocations(valuesetLocations);
      delta.setValueSets(valueSets);
      return delta;
    }

    if(sourceBindingDisplay != null) {
      // Deleted
      delta.setAction(DeltaAction.DELETED);
      DeltaNode<List<DisplayElement>> valueSets = new DeltaNode<>();
      valueSets.setPrevious(sourceBindingDisplay.getValueSetsDisplay());
      valueSets.setAction(DeltaAction.DELETED);
      DeltaNode<ValuesetStrength> strength = this.compare(sourceBindingDisplay.getStrength(), null);
      DeltaNode<Set<Integer>> valuesetLocations = this.compare(sourceBindingDisplay.getValuesetLocations(), null);
      delta.setStrength(strength);
      delta.setValuesetLocations(valuesetLocations);
      delta.setValueSets(valueSets);

      return delta;
    }

    if(targetBindingDisplay != null) {
      // Added
      DeltaNode<List<DisplayElement>> valueSets = new DeltaNode<>();
      valueSets.setCurrent(targetBindingDisplay.getValueSetsDisplay());
      valueSets.setAction(DeltaAction.ADDED);
      delta.setAction(DeltaAction.ADDED);
      delta.setValueSets(valueSets);
      DeltaNode<ValuesetStrength> strength = this.compare(null, targetBindingDisplay.getStrength());
      delta.setStrength(strength);
      DeltaNode<Set<Integer>> valuesetLocations = this.compare(null, targetBindingDisplay.getValuesetLocations());
      delta.setValuesetLocations(valuesetLocations);
      return delta;
    }

    return delta;
  }


  private DeltaNode<List<DisplayElement>> compareDisplay(List<DisplayElement> source, List<DisplayElement> target) {
    return this.compare(source, target, (s, t) -> this.compareListOfBinding(source,target ));
  }


  private Boolean compareListOfBinding(List<DisplayElement> source, List<DisplayElement> target) {
    Map<String, DisplayElement> sourceMap = source.stream().collect(Collectors.toMap(this::getUnicityKey, x-> x));
    Map<String, DisplayElement> targetMap = target.stream().collect(Collectors.toMap(this::getUnicityKey, x-> x));

    boolean equals = true;
    for(DisplayElement element : source) {
      String key = getUnicityKey(element);
      if(targetMap.containsKey(key)){
        element.setDelta(DeltaAction.UNCHANGED);
      } else {
        element.setDelta(DeltaAction.DELETED);
        equals = false;
      }
    }

    for(DisplayElement element : target) {
      String key = getUnicityKey(element);
      if(sourceMap.containsKey(key)){
        element.setDelta(DeltaAction.UNCHANGED);
      } else {
        element.setDelta(DeltaAction.ADDED);
        equals = false;
      }
    }
    return equals;
  }

  private String getUnicityKey(DisplayElement element) {
    String ret = element.getVariableName();
    if(element.getDomainInfo() !=null && element.getDomainInfo().getVersion() !=null) {
      ret += element.getDomainInfo().getVersion();
    }
    return ret;
  }

  private DeltaNode<ValuesetStrength> compare(ValuesetStrength source, ValuesetStrength target) {
    return this.compare(source, target, Enum::equals);
  }

  private DeltaNode<Set<Integer>> compare(Set<Integer> source, Set<Integer> target) {
    return this.compare(source, target, Set::equals);
  }

  public List<StructureDelta> compareDateAndTimeDatatypes(DateTimeDatatype source, DateTimeDatatype target) {
    List<StructureDelta> deltas= new ArrayList<StructureDelta>();
    Map<Integer , DateTimeComponentDefinition>  sourceMap = source.getDateTimeConstraints().getDateTimeComponentDefinitions().stream().collect(Collectors.toMap(x -> x.getPosition()  , x -> x));
    Map<Integer , DateTimeComponentDefinition>  targetMap= target.getDateTimeConstraints().getDateTimeComponentDefinitions().stream().collect(Collectors.toMap(x -> x.getPosition()  , x -> x));
    for(DateTimeComponentDefinition component: source.getDateTimeConstraints().getDateTimeComponentDefinitions()) {
      deltas.add(this.compare(component, targetMap.getOrDefault(component.getPosition(), null)));
    }
    for(DateTimeComponentDefinition component: target.getDateTimeConstraints().getDateTimeComponentDefinitions()) {
      if(!targetMap.containsKey(component.getPosition())) {
        deltas.add( this.compare(null, component));
      }
    }
    return deltas;
  }

  private StructureDelta compare(DateTimeComponentDefinition source, DateTimeComponentDefinition target) {
    StructureDelta result = new StructureDelta();
    StructureDeltaData data = new StructureDeltaData();
    data.setUsage(this.compare(source.getUsage(), target.getUsage()));
    data.setFormat(this.compare(source.getFormat(), target.getFormat()));
    data.setName(this.compare(source.getName(), target.getName()));
    data.setPosition(source.getPosition());
    result.setData(data);
    return result;
  }

}
