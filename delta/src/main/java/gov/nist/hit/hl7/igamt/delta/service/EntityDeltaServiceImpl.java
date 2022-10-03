package gov.nist.hit.hl7.igamt.delta.service;

import com.google.common.base.Strings;
import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.binding.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.*;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.*;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.delta.domain.*;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
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
import java.util.Map.Entry;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class EntityDeltaServiceImpl {


  @Autowired
  ValuesetService valueSetService;
  @Autowired
  ConformanceProfileService conformaneProfileService;
  @Autowired
  ProfileComponentService profileComponentService;
  @Autowired
  DatatypeService datatypeService;

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
        this.compareConformanceStatement(structureDelta, st, targetMap.get(st.getId()));
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
    Map<Integer, List<SubComponentStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<SubComponentStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    Map<Integer, List<SubComponentStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<SubComponentStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    return this.compareChildren(sourceChildren, targetChildren, this::compareSubComponentTreeModel);
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
    Map<Integer, List<ComponentStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<ComponentStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    Map<Integer, List<ComponentStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<ComponentStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    return this.compareChildren(sourceChildren, targetChildren, this::compareComponentTreeModel);
  }

  private List<StructureDelta> compareFields(Set<FieldStructureTreeModel> source, Set<FieldStructureTreeModel> target) {
    Map<Integer, List<FieldStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<FieldStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    Map<Integer, List<FieldStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<FieldStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    return this.compareChildren(sourceChildren, targetChildren, this::compareFieldTreeModel);
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
    Map<Integer, List<SegmentRefOrGroupStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<SegmentRefOrGroupStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy(this::getPosition));
    Map<Integer, List<SegmentRefOrGroupStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<SegmentRefOrGroupStructureTreeModel>())
            .stream()
            .collect(Collectors.groupingBy(this::getPosition));
    return this.compareChildren(sourceChildren, targetChildren, this::compareSegRefOrGroupTreeModel);
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
        .filter(x-> x.getValue()!= null).collect(Collectors.groupingBy(Code::getValue));
    Map<String, List<Code>> targetChildren = (target != null ? target : new HashSet<Code>()).stream()
    		.filter(x-> x.getValue()!= null).collect(Collectors.groupingBy(Code::getValue));

    for(Map.Entry<String, List<Code>> entry: sourceChildren.entrySet()) {
      CodeDelta codeDelta = new CodeDelta();
      codeDelta.setAction(DeltaAction.UNCHANGED);
      if(targetChildren.containsKey(entry.getKey())) {
        this.compareCode(codeDelta, entry.getValue().get(0), targetChildren.get(entry.getKey()).get(0));
        targetChildren.remove(entry.getKey());
      } else {
        this.compareCode(codeDelta, entry.getValue().get(0), entry.getValue().get(0));
        codeDelta.setAction(DeltaAction.DELETED);
      }

      deltas.add(codeDelta);
    }

    for(Map.Entry<String, List<Code>> entry: targetChildren.entrySet()) {
      CodeDelta codeDelta = new CodeDelta();
      codeDelta.setAction(DeltaAction.UNCHANGED);
      this.compareCode(codeDelta, entry.getValue().get(0), entry.getValue().get(0));
      codeDelta.setAction(DeltaAction.ADDED);
      deltas.add(codeDelta);
    }

    return deltas;
  }

  private ReferenceDelta compareDatatypeRef(DatatypeLabel source, DatatypeLabel target, ChangeReason reason) {
    ReferenceDelta ref = new ReferenceDelta();
    ref.setDomainInfo(this.compareDomainInfo(source.getDomainInfo(), target.getDomainInfo(), null));
    ref.setId(this.compareNAString(source.getId(), target.getId(), null));
    ref.setLabel(this.compareNAString(source.getLabel(), target.getLabel(), null));
    ref.setType(Type.DATATYPE);
    ref.setChangeReason(reason);
    return ref;
  }

  private void compareSubComponentTreeModel(StructureDelta structure, SubComponentStructureTreeModel source, SubComponentStructureTreeModel target) {
    ReferenceDelta ref = this.compareDatatypeRef(source.getData().getDatatypeLabel(), target.getData().getDatatypeLabel(), this.getChangeReason(target.getData().getChangeLog(), PropertyType.DATATYPE));
    structure.setType(source.getData().getType());
    structure.setReference(ref);
    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());
    this.compareComponent(structure, (Component) source.getData(), (Component) target.getData());
  }

  private void compareComponentTreeModel(StructureDelta structure, ComponentStructureTreeModel source, ComponentStructureTreeModel target) {
    ReferenceDelta ref = this.compareDatatypeRef(source.getData().getDatatypeLabel(), target.getData().getDatatypeLabel(), this.getChangeReason(target.getData().getChangeLog(), PropertyType.DATATYPE));
    structure.setType(source.getData().getType());
    structure.setReference(ref);
    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());
    this.compareComponent(structure, (Component) source.getData(), (Component) target.getData());
    structure.setChildren(this.compareSubComponents(source.getChildren(), target.getChildren()));
  }

  private void compareFieldTreeModel(StructureDelta structure, FieldStructureTreeModel source, FieldStructureTreeModel target) {
    ReferenceDelta ref = this.compareDatatypeRef(source.getData().getDatatypeLabel(), target.getData().getDatatypeLabel(), this.getChangeReason(target.getData().getChangeLog(), PropertyType.DATATYPE));
    structure.setType(source.getData().getType());
    structure.setReference(ref);
    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());
    this.compareField(structure, (Field) source.getData(), (Field) target.getData());
    structure.setChildren(this.compareComponents(source.getChildren(), target.getChildren()));
  }

  private void compareConformanceStatement(ConformanceStatementDelta delta, ConformanceStatement source, ConformanceStatement target) {
    delta.setAction(DeltaAction.UNCHANGED);
    delta.setDescription(this.compareNAString(source.generateDescription(), target.generateDescription(), null));
    delta.setIdentifier(this.compareNAString(source.getIdentifier(), target.getIdentifier(), null));
  }

  private void compareSegRefOrGroupTreeModel(StructureDelta structure, SegmentRefOrGroupStructureTreeModel source, SegmentRefOrGroupStructureTreeModel target) {
    if(source instanceof SegmentRefStructureTreeModel) {
      this.compareSegRefTreeModel(structure, (SegmentRefStructureTreeModel) source, (SegmentRefStructureTreeModel) target);
    } else if(source instanceof GroupStructureTreeModel) {
      this.compareGroupTreeModel(structure, (GroupStructureTreeModel) source, (GroupStructureTreeModel) target);
    }
  }

  private void compareSegRefTreeModel(StructureDelta structure, SegmentRefStructureTreeModel source, SegmentRefStructureTreeModel target) {
    ReferenceDelta ref = new ReferenceDelta();
    structure.setType(source.getData().getType());
    ref.setDomainInfo(this.compareDomainInfo(source.getData().getSegmentLabel().getDomainInfo(), target.getData().getSegmentLabel().getDomainInfo(), null));
    ref.setId(this.compareNAString(source.getData().getSegmentLabel().getId(), target.getData().getSegmentLabel().getId(), null));
    ref.setLabel(this.compareNAString(source.getData().getSegmentLabel().getLabel(), target.getData().getSegmentLabel().getLabel(), null));
    ref.setType(Type.SEGMENT);
    ref.setChangeReason(this.getChangeReason(target.getData().getChangeLog(), PropertyType.SEGMENTREF));
    structure.setReference(ref);


    this.compareMsgStructElement(structure, (MsgStructElement) source.getData(), (MsgStructElement) target.getData());
    structure.setChildren(this.compareFields(source.getChildren(), target.getChildren()));
  }

  private void compareGroupTreeModel(StructureDelta structure, GroupStructureTreeModel source, GroupStructureTreeModel target) {
    structure.setType(source.getData().getType());

    this.compareMsgStructElement(structure, (MsgStructElement) source.getData(), (MsgStructElement) target.getData());
    structure.setChildren(this.compareSegOrGroups(source.getChildren(), target.getChildren()));
  }


  private void compareComponent(StructureDelta structure, Component source, Component target) {
    structure.setConstantValue(this.compareNAString(source.getConstantValue(), target.getConstantValue(), this.getChangeReason(target.getChangeLog(), PropertyType.CONSTANTVALUE)));
    this.compareSubStructElement(structure, (SubStructElement) source, (SubStructElement) target);
  }

  private void compareField(StructureDelta structure, Field source, Field target) {
    structure.setConstantValue(this.compareNAString(source.getConstantValue(), target.getConstantValue(), this.getChangeReason(target.getChangeLog(), PropertyType.CONSTANTVALUE)));
    structure.setMinCardinality(this.compareInteger(source.getMin(), target.getMin(), this.getChangeReason(target.getChangeLog(), PropertyType.CARDINALITYMIN)));
    structure.setMaxCardinality(this.compareNAString(source.getMax(), target.getMax(), this.getChangeReason(target.getChangeLog(), PropertyType.CARDINALITYMAX)));
    this.compareSubStructElement(structure, (SubStructElement) source, (SubStructElement) target);
  }

  private void compareMsgStructElement(StructureDelta structure, MsgStructElement source, MsgStructElement target) {
    structure.setMinCardinality(this.compareInteger(source.getMin(), target.getMin(), this.getChangeReason(target.getChangeLog(), PropertyType.CARDINALITYMIN)));
    structure.setMaxCardinality(this.compareNAString(source.getMax(), target.getMax(), this.getChangeReason(target.getChangeLog(), PropertyType.CARDINALITYMAX)));
    this.compareStructureElement(structure, (StructureElement) source, (StructureElement) target);
  }

  private void compareSubStructElement(StructureDelta structure, SubStructElement source, SubStructElement target) {
    structure.setMaxLength(this.compareNAString(source.getMaxLength(), target.getMaxLength(), this.getChangeReason(target.getChangeLog(), PropertyType.LENGTHMAX)));
    structure.setMinLength(this.compareNAString(source.getMinLength(), target.getMinLength(), this.getChangeReason(target.getChangeLog(), PropertyType.LENGTHMIN)));
    structure.setConfLength(this.compareNAString(source.getConfLength(), target.getConfLength(), this.getChangeReason(target.getChangeLog(), PropertyType.CONFLENGTH)));
    this.compareStructureElement(structure, (StructureElement) source, (StructureElement) target);
  }

  private void compareStructureElement(StructureDelta structure, StructureElement source, StructureElement target) {
    structure.setUsage(this.compareUsage(source.getUsage(), target.getUsage(), this.getChangeReason(target.getChangeLog(), PropertyType.USAGE)));
    structure.setName(this.compareNAString(source.getName(), target.getName(), null));
    structure.setDefinition(this.compareNAString(source.getText(), target.getText(), null));
    structure.setPosition(source.getPosition());
  }

  private void compareCode(CodeDelta structure, Code source, Code target) {
    structure.setUsage(this.compareCodeUsage(source.getUsage(), target.getUsage(), null));
    structure.setValue(this.compareNAString(source.getValue(), target.getValue(), null));
    structure.setCodeSystem(this.compareNAString(source.getCodeSystem(), target.getCodeSystem(), null));
    structure.setCodeSystemOid(this.compareNAString(source.getCodeSystemOid(), target.getCodeSystemOid(), null));
    structure.setDescription(this.compareNAString(source.getDescription(), target.getDescription(), null));
    structure.setComments(this.compareNAString(source.getComments(), target.getComments(), null));
  }

  private ChangeReason getChangeReason(Map<PropertyType, ChangeReason> log, PropertyType prop) {
    if(log!= null) {
      return log.get(prop);
    } else {
      return null;
    }
  }


  private DeltaNode<DomainInfo> compareDomainInfo(DomainInfo source, DomainInfo target, ChangeReason reason) {
    return this.compare(source, target, (s, t) -> s.getVersion().equals(t.getVersion()) && s.getScope().equals(t.getScope()), reason);
  }

  private DeltaNode<String> compareNAString(String source, String target, ChangeReason reason) {
    return this.compare(source, target, (elm) -> elm != null && !elm.equals("NA") && !elm.equals(""), String::equals, reason);
  }

  private DeltaNode<Usage> compareUsage(Usage source, Usage target, ChangeReason reason) {
    return this.compare(source, target, Enum::equals, reason);
  }

  private DeltaNode<List<String>> compare(List<String> source, List<String> target, ChangeReason reason) {
    return this.compare(source, target, List::equals, reason);
  }

  private DeltaNode<CodeUsage> compareCodeUsage(CodeUsage source, CodeUsage target, ChangeReason reason) {
    return this.compare(source, target, Enum::equals, reason);
  }

  private DeltaNode<Integer> compareInteger(int source, int target, ChangeReason reason) {
    return this.compare(source, target, Integer::equals, reason);
  }

  private <T> DeltaNode<T> compare(T source, T target, BiFunction<T, T, Boolean> f, ChangeReason reason) {
    return this.compare(source, target, Objects::nonNull, f, reason);
  }

  private <T> DeltaNode<T> compare(T source, T target, Function<T, Boolean> valued, BiFunction<T, T, Boolean> equal, ChangeReason reason) {
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
    node.setChangeReason(reason);
    return node;
  }

  private DeltaNode<Stability> compare(Stability source, Stability target) {
    return this.compare(source, target, Enum::equals, null);
  }

  private DeltaNode<Extensibility> compare(Extensibility source, Extensibility target) {
    return this.compare(source, target, Enum::equals, null);
  }

  private DeltaNode<ContentDefinition> compare(ContentDefinition source, ContentDefinition target) {
    return this.compare(source, target, Enum::equals, null);
  }

  private void compareBindings(StructureDelta structure, BindingDisplay source, BindingDisplay target) {
//    compareValueSetBinding(structure,  source,  target);
    if(source != null) {
      if(target != null) {
        if(source.getPredicate() == null ) {
          if(target.getPredicate() != null) {
            // predicate added
            structure.setPredicate(this.comparePredicates(new Predicate(), target.getPredicate(), this.getChangeReason(target.getChangeLog(), PropertyType.PREDICATE)));
            structure.getPredicate().setAction(DeltaAction.ADDED);
            structure.setAction(DeltaAction.UPDATED);
          }
        } else {
          if(target.getPredicate() == null) {
            // predicate removed
            structure.setPredicate(this.comparePredicates(source.getPredicate(), new Predicate(), this.getChangeReason(target.getChangeLog(), PropertyType.PREDICATE)));
            structure.getPredicate().setAction(DeltaAction.DELETED);
            structure.setAction(DeltaAction.UPDATED);
          } else {
            // predicate changed
            structure.setPredicate(this.comparePredicates(source.getPredicate(), target.getPredicate(), this.getChangeReason(target.getChangeLog(), PropertyType.PREDICATE)));
          }
        }
      }
    } else {
      if(target != null) {
        if(target.getPredicate() != null) {
          // predicate added
          structure.setPredicate(this.comparePredicates(new Predicate(), target.getPredicate(), this.getChangeReason(target.getChangeLog(), PropertyType.PREDICATE)));
          structure.getPredicate().setAction(DeltaAction.ADDED);
          structure.setAction(DeltaAction.UPDATED);
        }
      }
    }

  }


//  private void compareValueSetBinding(StructureDelta structure, BindingDisplay source, BindingDisplay target) {
//    if(source !=null && target !=null) {
//
//      if(source.getBindingType().equals(target.getBindingType())) {
//
//        if(source.getBindingType().equals(BindingType.VS)) {
//          structure.setValueSetBinding(this.compareValueSetBinding(source.getValuesetBindings(), target.getValuesetBindings(), this.getChangeReason(target.getChangeLog(), PropertyType.VALUESET)));
//        }else if(source.getBindingType().equals(BindingType.SC)){
//          structure.setInternalSingleCode(this.compareInternalSingleCodes(source.getInternalSingleCode(), target.getInternalSingleCode(), this.getChangeReason(target.getChangeLog(), PropertyType.SINGLECODE)));
//        }
//      } else {
//        if(source.getBindingType().equals(BindingType.VS)) {
//          if(target.getBindingType().equals(BindingType.SC)) {
//
//            structure.setValueSetBinding(this.compareValueSetBinding(source.getValuesetBindings(), new HashSet<DisplayValuesetBinding>(), this.getChangeReason(target.getChangeLog(), PropertyType.VALUESET)));
//            structure.setInternalSingleCode(this.compareInternalSingleCodes(new InternalSingleCode(), target.getInternalSingleCode(), this.getChangeReason(target.getChangeLog(), PropertyType.SINGLECODE)));
//            structure.getValueSetBinding().setAction(DeltaAction.DELETED);
//            structure.getInternalSingleCode().setAction(DeltaAction.ADDED);
//
//          }
//
//        }else if(source.getBindingType().equals(BindingType.SC)){
//
//          if(target.getBindingType().equals(BindingType.VS)) {
//
//            structure.setValueSetBinding(this.compareValueSetBinding(new HashSet<DisplayValuesetBinding>(), target.getValuesetBindings(), this.getChangeReason(target.getChangeLog(), PropertyType.VALUESET)));
//            structure.setInternalSingleCode(this.compareInternalSingleCodes(source.getInternalSingleCode() , target.getInternalSingleCode(), this.getChangeReason(target.getChangeLog(), PropertyType.SINGLECODE)));
//            structure.getValueSetBinding().setAction(DeltaAction.ADDED);
//            structure.getInternalSingleCode().setAction(DeltaAction.DELETED);
//          }
//        }
//      }
//    } else if(source == null && target != null){
//        if(target.getBindingType().equals(BindingType.VS)){
//            structure.setValueSetBinding(this.compareValueSetBinding(new HashSet<DisplayValuesetBinding>(), target.getValuesetBindings(), this.getChangeReason(target.getChangeLog(), PropertyType.VALUESET)));
//            structure.getValueSetBinding().setAction(DeltaAction.ADDED);
//
//        } else if(target.getBindingType().equals(BindingType.SC)){
//            structure.setInternalSingleCode(this.compareInternalSingleCodes(new InternalSingleCode() , target.getInternalSingleCode(), this.getChangeReason(target.getChangeLog(), PropertyType.SINGLECODE)));
//            structure.getInternalSingleCode().setAction(DeltaAction.ADDED);
//        }
//    }
//  }

  public PredicateDelta comparePredicates(Predicate source, Predicate target, ChangeReason changeReason) {
    PredicateDelta delta = new PredicateDelta();
    delta.setAction(DeltaAction.UNCHANGED);
    DeltaNode<Usage> trueUsage = this.compareUsage(source.getTrueUsage(), target.getTrueUsage(), null);
    delta.setTrueUsage(trueUsage);
    DeltaNode<Usage> falseUsage = this.compareUsage(source.getFalseUsage(), target.getFalseUsage(), null);
    delta.setFalseUsage(falseUsage);
    DeltaNode<String> description = this.compareNAString(source.generateDescription(), target.generateDescription(), null);
    delta.setDescription(description);
    delta.setChangeReason(changeReason);
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

//  public DeltaInternalSingleCode compareInternalSingleCodes(InternalSingleCode source, InternalSingleCode target, ChangeReason changeReason) {
//    DeltaInternalSingleCode delta = new DeltaInternalSingleCode();
//    delta.setAction(DeltaAction.UNCHANGED);
//    delta.setChangeReason(changeReason);
//
//    if(source != null && target != null) {
//      DisplayElement vsSourceDisplay = this.makeDisplayElementForSingleCode(source);
//      DisplayElement vsTargetDisplay = this.makeDisplayElementForSingleCode(target);
//
//      DeltaNode<DisplayElement> valueSetDisplay = this.compare(vsSourceDisplay, vsTargetDisplay);
//      DeltaNode<String> codeSystem = this.compareNAString(source.getCodeSystem(), target.getCodeSystem(), null);
//      DeltaNode<String> code = this.compareNAString(source.getCode(), target.getCode(), null);
//
//      delta.setCode(code);
//      delta.setValueSetDisplay(valueSetDisplay);
//      delta.setCodeSystem(codeSystem);
//      return delta;
//    }
//
//    if(source != null) {
//      // Deleted
//      delta.setAction(DeltaAction.DELETED);
//      DisplayElement vsSourceDisplay = this.makeDisplayElementForSingleCode(source);
//
//      DeltaNode<DisplayElement> valueSetDisplay = this.compare(vsSourceDisplay, null);
//      DeltaNode<String> codeSystem = this.compareNAString(source.getCodeSystem(), null, null);
//      DeltaNode<String> code = this.compareNAString(source.getCode(), null, null);
//
//      delta.setCode(code);
//      delta.setValueSetDisplay(valueSetDisplay);
//      delta.setCodeSystem(codeSystem);
//      return delta;
//    }
//
//    if(target != null) {
//      // Added
//      delta.setAction(DeltaAction.ADDED);
//      DisplayElement vsTargetDisplay = this.makeDisplayElementForSingleCode(target);
//
//      DeltaNode<DisplayElement> valueSetDisplay = this.compare(null, vsTargetDisplay);
//      DeltaNode<String> codeSystem = this.compareNAString(null, target.getCodeSystem(), null);
//      DeltaNode<String> code = this.compareNAString(null, target.getCode(), null);
//
//      delta.setCode(code);
//      delta.setValueSetDisplay(valueSetDisplay);
//      delta.setCodeSystem(codeSystem);
//      return delta;
//    }
//
//    return  delta;
//  }


  private DeltaNode<DisplayElement> compare(DisplayElement vsSourceDisplay, DisplayElement vsTargetDisplay) {
    return this.compare(vsSourceDisplay, vsTargetDisplay, (s, t) -> vsSourceDisplay.getVariableName().equals(vsTargetDisplay.getVariableName()), null);
  }

//  public DeltaValuesetBinding compareValueSetBinding(Set<DisplayValuesetBinding> source, Set<DisplayValuesetBinding> target, ChangeReason changeReason) {
//    DeltaValuesetBinding delta = new DeltaValuesetBinding();
//    delta.setAction(DeltaAction.UNCHANGED);
//    delta.setChangeReason(changeReason);
//    DisplayValuesetBinding sourceBindingDisplay = source != null ? source.stream().findFirst().orElse(null) : null;
//    DisplayValuesetBinding targetBindingDisplay = target != null ? target.stream().findFirst().orElse(null) : null;
//
//    if(sourceBindingDisplay != null && targetBindingDisplay != null) {
//      DeltaNode<List<DisplayElement>> valueSets = this.compareDisplay(sourceBindingDisplay.getValueSetsDisplay(), targetBindingDisplay.getValueSetsDisplay());
//      DeltaNode<ValuesetStrength> strength = this.compare(sourceBindingDisplay.getStrength(), targetBindingDisplay.getStrength());
//      DeltaNode<Set<Integer>> valuesetLocations = this.compare(sourceBindingDisplay.getValuesetLocations(), targetBindingDisplay.getValuesetLocations());
//      delta.setStrength(strength);
//      delta.setValuesetLocations(valuesetLocations);
//      delta.setValueSets(valueSets);
//      return delta;
//    }
//
//    if(sourceBindingDisplay != null) {
//      // Deleted
//      delta.setAction(DeltaAction.DELETED);
//      DeltaNode<List<DisplayElement>> valueSets = new DeltaNode<>();
//      valueSets.setPrevious(sourceBindingDisplay.getValueSetsDisplay());
//      valueSets.setAction(DeltaAction.DELETED);
//      DeltaNode<ValuesetStrength> strength = this.compare(sourceBindingDisplay.getStrength(), null);
//      DeltaNode<Set<Integer>> valuesetLocations = this.compare(sourceBindingDisplay.getValuesetLocations(), null);
//      delta.setStrength(strength);
//      delta.setValuesetLocations(valuesetLocations);
//      delta.setValueSets(valueSets);
//
//      return delta;
//    }
//
//    if(targetBindingDisplay != null) {
//      // Added
//      DeltaNode<List<DisplayElement>> valueSets = new DeltaNode<>();
//      valueSets.setCurrent(targetBindingDisplay.getValueSetsDisplay());
//      valueSets.setAction(DeltaAction.ADDED);
//      delta.setAction(DeltaAction.ADDED);
//      delta.setValueSets(valueSets);
//      DeltaNode<ValuesetStrength> strength = this.compare(null, targetBindingDisplay.getStrength());
//      delta.setStrength(strength);
//      DeltaNode<Set<Integer>> valuesetLocations = this.compare(null, targetBindingDisplay.getValuesetLocations());
//      delta.setValuesetLocations(valuesetLocations);
//      return delta;
//    }
//
//    return delta;
//  }


  private DeltaNode<List<DisplayElement>> compareDisplay(List<DisplayElement> source, List<DisplayElement> target) {
    return this.compare(source, target, (s, t) -> this.compareListOfBinding(source,target), null);
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
    return this.compare(source, target, Enum::equals, null);
  }

  private DeltaNode<Set<Integer>> compare(Set<Integer> source, Set<Integer> target) {
    return this.compare(source, target, Set::equals, null);
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
    data.setUsage(this.compareUsage(source.getUsage(), target.getUsage(), null));
    data.setFormat(this.compareNAString(source.getFormat(), target.getFormat(), null));
    data.setName(this.compareNAString(source.getName(), target.getName(), null));
    data.setPosition(source.getPosition());
    result.setData(data);
    return result;
  }

  public List<DynamicMappingItemDelta> compareDynamicMapping(DynamicMappingInfo source,
      DynamicMappingInfo target) {
    List<DynamicMappingItemDelta> ret = new ArrayList<DynamicMappingItemDelta>();
   Map<String, String> sourceMap = new HashMap<String, String>();
   Map<String, String> targetMap = new HashMap<String, String>();
  
   if(source != null && source.getItems() !=null) {
     sourceMap = source.getItems().stream().collect(Collectors.toMap(x->x.getValue(), x-> x.getDatatypeId()));
   }
   if(target != null && target.getItems() !=null) {
     targetMap = target.getItems().stream().collect(Collectors.toMap(x->x.getValue(), x-> x.getDatatypeId()));
   }
   
   for(String s: sourceMap.keySet() ) {
     DynamicMappingItemDelta delta = new DynamicMappingItemDelta();
     DeltaNode<String> node = new  DeltaNode<String>();
     delta.setFlavorId(node);
     delta.setDatatypeName(s);
     node.setPrevious(sourceMap.get(s));

     if(targetMap.containsKey(s)) {
       node.setCurrent(targetMap.get(s));
       if(sourceMap.get(s).equals(targetMap.get(s))) {
         node.setAction(DeltaAction.UNCHANGED);
       } else {
    	   	  
    	      Datatype targetDT = this.datatypeService.findById(targetMap.get(s));
    	      if(targetDT.getOrigin() != null && targetDT.getOrigin().equals(sourceMap.get(s))) {
    	    	  
        	      Datatype sourceDT = this.datatypeService.findById(sourceMap.get(s));
        	      DatatypeStructureDisplay sourceDisplay = this.datatypeService.convertDomainToStructureDisplay(sourceDT, true);
        	      DatatypeStructureDisplay targetDisplay = this.datatypeService.convertDomainToStructureDisplay(targetDT, true);
        	      List<StructureDelta> structure =  compareDatatype(sourceDisplay, targetDisplay);
        	      List<ConformanceStatementDelta> conformanceStatements = compareConformanceStatements(sourceDisplay.getConformanceStatements(), targetDisplay.getConformanceStatements());
        	      ResourceDelta rd = new ResourceDelta();
        	      rd.setStructureDelta(structure);
        	      rd.setConformanceStatementDelta(conformanceStatements);
        	      
        	      DeltaAction act = DeltaAction.UNCHANGED;
        	      if(structure !=null)
        	        for(StructureDelta child: structure ) {
        	          if(child.getData() !=null && child.getData().getAction() != DeltaAction.UNCHANGED) {
        	            act =  DeltaAction.UPDATED;
        	          }
        	        }
        	      for(ConformanceStatementDelta child: conformanceStatements ) {
        	        if( child.getAction() != DeltaAction.UNCHANGED) {
        	        	act = DeltaAction.UPDATED;
        	        }
        	      }
        	      node.setAction(act);
        	 
    	      }else {
    	          node.setAction(DeltaAction.CHANGED);

    	      }
    	   
       }
     }else {
       node.setCurrent(null);
       node.setAction(DeltaAction.DELETED);
     }
     delta.setAction(node.getAction());
     ret.add(delta);
   }
   
   for(String t: targetMap.keySet() ) {
     if(!sourceMap.containsKey(t)) {
       DynamicMappingItemDelta delta = new DynamicMappingItemDelta();
       DeltaNode<String> node = new  DeltaNode<String>();
       node.setCurrent(targetMap.get(t));
       delta.setFlavorId(node);
       delta.setDatatypeName(t);
       node.setAction(DeltaAction.ADDED);
       delta.setAction(node.getAction());
       ret.add(delta);
     }
   }
   return ret;
  }


  /**
   * @param orderedProfileComponents
   * @param orderedProfileComponents2
   * @return
   */
  public List<ProfileComponentLinkDelta> compareProfileComponents(
      Set<OrderedProfileComponentLink> source,
      Set<OrderedProfileComponentLink> target) {
    
    List<ProfileComponentLinkDelta> deltas = new ArrayList<>();
    Map<Integer, OrderedProfileComponentLink> sourceMap = source != null ? source.stream().collect(Collectors.toMap(OrderedProfileComponentLink::getPosition, x-> x)) : new HashMap<>();
    Map<Integer, OrderedProfileComponentLink> targetMap = target != null ? target.stream().collect(Collectors.toMap(OrderedProfileComponentLink::getPosition, x-> x)) : new HashMap<>();

    sourceMap.values().forEach((pc) -> {
      ProfileComponentLinkDelta delta = new ProfileComponentLinkDelta();
      delta.setPosition(pc.getPosition());
      
      if(!targetMap.containsKey(pc.getPosition())) {
        DeltaNode<String> node = new DeltaNode<String>(pc.getProfileComponentId(), null, DeltaAction.DELETED);
        delta.setNode(node);
        delta.setDelta(DeltaAction.DELETED);
      }else {
        DeltaNode<String> node =  this.comparePcs(pc,targetMap.get(pc.getPosition()));
        delta.setNode(node);
        delta.setDelta(node.getAction());
      }
      deltas.add(delta);
    });

    targetMap.values().forEach((pc) -> {
      
      if(!sourceMap.containsKey(pc.getPosition())) {
        ProfileComponentLinkDelta delta = new ProfileComponentLinkDelta();
        delta.setPosition(pc.getPosition());
        DeltaNode<String> node = new DeltaNode<String>(null, pc.getProfileComponentId(), DeltaAction.ADDED);
        delta.setNode(node);
        delta.setDelta(DeltaAction.ADDED);
        deltas.add(delta);
      }
    });

    return deltas;
    
    }

  /**
   * @param pc
   * @param orderedProfileComponentLink
   * @return
   */
  private DeltaNode<String> comparePcs(OrderedProfileComponentLink source,
      OrderedProfileComponentLink target) {
    
    ProfileComponent pcTarget = this.profileComponentService.findById(target.getProfileComponentId());
    if(pcTarget.isDerived() && pcTarget.getOrigin().equals(source.getProfileComponentId())) {
      return new DeltaNode<String>(pcTarget.getId(), pcTarget.getId(), DeltaAction.UNCHANGED);
    }else {
      return new DeltaNode<String>(source.getProfileComponentId(), target.getProfileComponentId(), DeltaAction.UPDATED);
    }
  }
  
  

}
