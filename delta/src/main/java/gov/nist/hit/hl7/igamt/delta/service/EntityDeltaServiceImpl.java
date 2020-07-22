package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.*;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.DisplayPredicate;
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

import org.hl7.fhir.r4.model.codesystems.ActionSelectionBehavior;
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
  
  
  public List<StructureDelta> datatype(DatatypeStructureDisplay source, DatatypeStructureDisplay target) {
    List<StructureDelta> result = new ArrayList<>();
    result.addAll(this.compareComponents(source.getStructure(), target.getStructure()));
    //        result.addAll(this.compareConformanceStatements(source.getConformanceStatements(), target.getConformanceStatements()));
    return result;

  }

//  public  List<ConformanceStatementDelta> conformanceStatements(Set<ConformanceStatement> source, Set<ConformanceStatement> target) {
//    List<ConformanceStatementDelta> deltas = new ArrayList<>();
//    Map<String, List<ConformanceStatement>> sourceChildren = (source != null ? source : new HashSet<ConformanceStatement>()).stream()
//        .collect(Collectors.groupingBy((e) -> e.getIdentifier()));
//    Map<String, List<ConformanceStatement>> targetChildren = (target != null ? target : new HashSet<ConformanceStatement>()).stream()
//        .collect(Collectors.groupingBy((e) -> e.getIdentifier()));
//
//    for(Map.Entry<String, List<ConformanceStatement>> entry: sourceChildren.entrySet()) {
//      ConformanceStatementDelta structureDelta = new ConformanceStatementDelta();
//      if(targetChildren.containsKey(entry.getKey())) {
//        this.compare(structureDelta, entry.getValue().get(0), targetChildren.get(entry.getKey()).get(0));
//        targetChildren.remove(entry.getKey());
//      } else {
//        this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
//        structureDelta.setAction(DeltaAction.DELETED);
//      }
//
//      deltas.add(structureDelta);
//    }
//
//    for(Map.Entry<String, List<ConformanceStatement>> entry: targetChildren.entrySet()) {
//      ConformanceStatementDelta structureDelta = new ConformanceStatementDelta();
//      this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
//      structureDelta.setAction(DeltaAction.ADDED);
//      deltas.add(structureDelta);
//    }
//
//    return deltas;
//
//  }
  public  List<ConformanceStatementDelta> conformanceStatements(Set<ConformanceStatement> source, Set<ConformanceStatement> target) {
    List<ConformanceStatementDelta> deltas = new ArrayList<>();
    Map<String, ConformanceStatement> sourceMap = new HashMap<String, ConformanceStatement>();
    Map<String, ConformanceStatement> targetMap = new HashMap<String, ConformanceStatement>();
    if(source!=null && !source.isEmpty()) {
      for(ConformanceStatement s : source) {
        if(s.getIdentifier() !=null) {
          sourceMap.put(s.getIdentifier(), s);
        }
      }
    }
    if(target !=null&& source !=null && !source.isEmpty()) {
      for(ConformanceStatement s : target) {
        if(s.getIdentifier() !=null) {
          targetMap.put(s.getIdentifier(), s);
        }
      }
    }
    if(source !=null)
    for(ConformanceStatement st: source) {
      ConformanceStatementDelta structureDelta = new ConformanceStatementDelta();

      if(targetMap.containsKey(st.getIdentifier())) {
        this.compare(structureDelta, st, targetMap.get(st.getIdentifier()));
      }else {
        structureDelta.setDescription(new DeltaNode<String>(st.generateDescription(), null, DeltaAction.DELETED));
        structureDelta.setIdentifier(new DeltaNode<String>(st.getIdentifier(), null, DeltaAction.DELETED));
        structureDelta.setAction(DeltaAction.DELETED);
        deltas.add(structureDelta);
      }
    }
    if(target !=null)
    for(ConformanceStatement st: target) {
      ConformanceStatementDelta structureDelta = new ConformanceStatementDelta();

      if(!sourceMap.containsKey(st.getIdentifier())) {
        structureDelta.setDescription(new DeltaNode<String>( null,st.generateDescription(), DeltaAction.ADDED));
        structureDelta.setIdentifier(new DeltaNode<String>( null,st.getIdentifier(), DeltaAction.ADDED));
        structureDelta.setAction(DeltaAction.ADDED);

        deltas.add(structureDelta);
      }      

    }

    return deltas;

  }

  public List<StructureDelta> segment(SegmentStructureDisplay source, SegmentStructureDisplay target) {
    List<StructureDelta> result = new ArrayList<>();
    result.addAll(this.compareFields(source.getStructure(), target.getStructure()));
    //        result.addAll(this.compareConformanceStatements(source.getConformanceStatements(), target.getConformanceStatements()));
    return result;
  }

  public ValuesetDelta valueset(Valueset source, Valueset target) {
    ValuesetDelta valuesetDelta = this.compareValuesetMetadata(source, target);
    List<CodeDelta> codeDeltas = this.compareCodes(source.getCodes(), target.getCodes());
    valuesetDelta.setCodes(codeDeltas);
    return valuesetDelta;
  }

  public List<StructureDelta> conformanceProfile(ConformanceProfileStructureDisplay source, ConformanceProfileStructureDisplay target) {
    return this.compareSegOrGroups(source.getStructure(), target.getStructure());
  }

  private <T> List<StructureDelta> compareSubComponents(Set<SubComponentStructureTreeModel> source, Set<SubComponentStructureTreeModel> target) {
    List<StructureDelta> deltas = new ArrayList<>();
    Map<Integer, List<SubComponentStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<SubComponentStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    Map<Integer, List<SubComponentStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<SubComponentStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    for(Map.Entry<Integer, List<SubComponentStructureTreeModel>> entry: sourceChildren.entrySet()) {
      StructureDelta structureDelta = new StructureDelta();
      if(targetChildren.containsKey(entry.getKey())) {
        this.compare(structureDelta, entry.getValue().get(0), targetChildren.get(entry.getKey()).get(0));
        targetChildren.remove(entry.getKey());
      } else {
        this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
        structureDelta.setAction(DeltaAction.DELETED);
      }
      deltas.add(structureDelta);
    }

    for(Map.Entry<Integer, List<SubComponentStructureTreeModel>> entry: targetChildren.entrySet()) {
      StructureDelta structureDelta = new StructureDelta();
      this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
      structureDelta.setAction(DeltaAction.ADDED);
      deltas.add(structureDelta);
    }

    return deltas;
  }

  private List<StructureDelta> compareComponents(Set<ComponentStructureTreeModel> source, Set<ComponentStructureTreeModel> target) {
    List<StructureDelta> deltas = new ArrayList<>();
    Map<Integer, List<ComponentStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<ComponentStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    Map<Integer, List<ComponentStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<ComponentStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    for(Map.Entry<Integer, List<ComponentStructureTreeModel>> entry: sourceChildren.entrySet()) {
      StructureDelta structureDelta = new StructureDelta();
      if(targetChildren.containsKey(entry.getKey())) {
        this.compare(structureDelta, entry.getValue().get(0), targetChildren.get(entry.getKey()).get(0));
        targetChildren.remove(entry.getKey());
      } else {
        this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
        structureDelta.setAction(DeltaAction.DELETED);
      }

      deltas.add(structureDelta);
    }

    for(Map.Entry<Integer, List<ComponentStructureTreeModel>> entry: targetChildren.entrySet()) {
      StructureDelta structureDelta = new StructureDelta();
      this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
      structureDelta.setAction(DeltaAction.ADDED);
      deltas.add(structureDelta);
    }

    return deltas;
  }
//
//  private  List<StructureDelta> compareConformanceStatements(Set<ConformanceStatement> source, Set<ConformanceStatement> target) {
//    List<StructureDelta> deltas = new ArrayList<>();
//    Map<String, List<ConformanceStatement>> sourceChildren = (source != null ? source : new HashSet<ConformanceStatement>()).stream()
//        .collect(Collectors.groupingBy((e) -> e.getIdentifier()));
//    Map<String, List<ConformanceStatement>> targetChildren = (target != null ? target : new HashSet<ConformanceStatement>()).stream()
//        .collect(Collectors.groupingBy((e) -> e.getIdentifier()));
//
//    for(Map.Entry<String, List<ConformanceStatement>> entry: sourceChildren.entrySet()) {
//      StructureDelta structureDelta = new StructureDelta();
//      if(targetChildren.containsKey(entry.getKey())) {
//        this.compare(structureDelta, entry.getValue().get(0), targetChildren.get(entry.getKey()).get(0));
//        targetChildren.remove(entry.getKey());
//      } else {
//        this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
//        structureDelta.setAction(DeltaAction.DELETED);
//      }
//
//      deltas.add(structureDelta);
//    }
//
//    for(Map.Entry<String, List<ConformanceStatement>> entry: targetChildren.entrySet()) {
//      StructureDelta structureDelta = new StructureDelta();
//      this.compare(structureDelta, new ConformanceStatement(), entry.getValue().get(0));
//      structureDelta.setAction(DeltaAction.ADDED);
//      deltas.add(structureDelta);
//    }
//
//    return deltas;
//
//  }

  private List<StructureDelta> compareFields(Set<FieldStructureTreeModel> source, Set<FieldStructureTreeModel> target) {
    List<StructureDelta> deltas = new ArrayList<>();
    Map<Integer, List<FieldStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<FieldStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));
    Map<Integer, List<FieldStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<FieldStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getData().getPosition()));

    for(Map.Entry<Integer, List<FieldStructureTreeModel>> entry: sourceChildren.entrySet()) {
      StructureDelta structureDelta = new StructureDelta();
      if(targetChildren.containsKey(entry.getKey())) {
        this.compare(structureDelta, entry.getValue().get(0), targetChildren.get(entry.getKey()).get(0));
        targetChildren.remove(entry.getKey());
      } else {
        this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
        structureDelta.setAction(DeltaAction.DELETED);
      }

      deltas.add(structureDelta);
    }

    for(Map.Entry<Integer, List<FieldStructureTreeModel>> entry: targetChildren.entrySet()) {
      StructureDelta structureDelta = new StructureDelta();
      this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
      structureDelta.setAction(DeltaAction.ADDED);
      deltas.add(structureDelta);
    }

    return deltas;
  }

  private List<StructureDelta> compareSegOrGroups(Set<SegmentRefOrGroupStructureTreeModel> source, Set<SegmentRefOrGroupStructureTreeModel> target) {
    List<StructureDelta> deltas = new ArrayList<>();
    Map<Integer, List<SegmentRefOrGroupStructureTreeModel>> sourceChildren = (source != null ? source : new HashSet<SegmentRefOrGroupStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> {
          if(e instanceof SegmentRefStructureTreeModel) {
            return ((SegmentRefStructureTreeModel) e).getData().getPosition();
          } else if(e instanceof GroupStructureTreeModel) {
            return ((GroupStructureTreeModel) e).getData().getPosition();
          }
          return -1;
        }));
    Map<Integer, List<SegmentRefOrGroupStructureTreeModel>> targetChildren = (target != null ? target : new HashSet<SegmentRefOrGroupStructureTreeModel>()).stream()
        .collect(Collectors.groupingBy((e) -> {
          if(e instanceof SegmentRefStructureTreeModel) {
            return ((SegmentRefStructureTreeModel) e).getData().getPosition();
          } else if(e instanceof GroupStructureTreeModel) {
            return ((GroupStructureTreeModel) e).getData().getPosition();
          }
          return -1;
        }));

    for(Map.Entry<Integer, List<SegmentRefOrGroupStructureTreeModel>> entry: sourceChildren.entrySet()) {
      StructureDelta structureDelta = new StructureDelta();
      if(targetChildren.containsKey(entry.getKey())) {
        this.compare(structureDelta, entry.getValue().get(0), targetChildren.get(entry.getKey()).get(0));
        targetChildren.remove(entry.getKey());
      } else {
        this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
        structureDelta.setAction(DeltaAction.DELETED);
      }

      deltas.add(structureDelta);
    }

    for(Map.Entry<Integer, List<SegmentRefOrGroupStructureTreeModel>> entry: targetChildren.entrySet()) {
      StructureDelta structureDelta = new StructureDelta();
      this.compare(structureDelta, entry.getValue().get(0), entry.getValue().get(0));
      structureDelta.setAction(DeltaAction.ADDED);
      deltas.add(structureDelta);
    }

    return deltas;
  }



  public ValuesetDelta compareValuesetMetadata(Valueset source, Valueset target) {
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
        .collect(Collectors.groupingBy((e) -> e.getValue()));
    Map<String, List<Code>> targetChildren = (target != null ? target : new HashSet<Code>()).stream()
        .collect(Collectors.groupingBy((e) -> e.getValue()));

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

  private void compare(StructureDelta structure, SubComponentStructureTreeModel source, SubComponentStructureTreeModel target) {
    ReferenceDelta ref = new ReferenceDelta();
    structure.setType(source.getData().getType());
    ref.setDomainInfo(this.compare(source.getData().getDatatypeLabel().getDomainInfo(), target.getData().getDatatypeLabel().getDomainInfo()));
    ref.setId(this.compare(source.getData().getDatatypeLabel().getId(), target.getData().getDatatypeLabel().getId()));
    ref.setLabel(this.compare(source.getData().getDatatypeLabel().getLabel(), target.getData().getDatatypeLabel().getLabel()));
    ref.setType(Type.DATATYPE);
    structure.setReference(ref);
    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());

    //        structure.setValueSetBinding(this.compareValueSetBinding(source.getData().getBinding(),target.getData().getBinding()));

    this.compare(structure, (Component) source.getData(), (Component) target.getData());
  }

  private void compare(StructureDelta structure, ComponentStructureTreeModel source,  ComponentStructureTreeModel target) {
    ReferenceDelta ref = new ReferenceDelta();
    structure.setType(source.getData().getType());
    ref.setDomainInfo(this.compare(source.getData().getDatatypeLabel().getDomainInfo(), target.getData().getDatatypeLabel().getDomainInfo()));
    ref.setId(this.compare(source.getData().getDatatypeLabel().getId(), target.getData().getDatatypeLabel().getId()));
    ref.setLabel(this.compare(source.getData().getDatatypeLabel().getLabel(), target.getData().getDatatypeLabel().getLabel()));
    ref.setType(Type.DATATYPE);
    structure.setReference(ref);

    //        structure.setValueSetBinding(this.compareValueSetBinding(source.getData().getBinding(),target.getData().getBinding()));
    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());


    this.compare(structure, (Component) source.getData(), (Component) target.getData());
    structure.setChildren(this.compareSubComponents(source.getChildren(), target.getChildren()));
  }

  private void compare(StructureDelta structure, FieldStructureTreeModel source, FieldStructureTreeModel target) {
    ReferenceDelta ref = new ReferenceDelta();
    structure.setType(source.getData().getType());
    ref.setDomainInfo(this.compare(source.getData().getDatatypeLabel().getDomainInfo(), target.getData().getDatatypeLabel().getDomainInfo()));
    ref.setId(this.compare(source.getData().getDatatypeLabel().getId(), target.getData().getDatatypeLabel().getId()));
    ref.setLabel(this.compare(source.getData().getDatatypeLabel().getLabel(), target.getData().getDatatypeLabel().getLabel()));
    ref.setType(Type.DATATYPE);
    structure.setReference(ref);
    //        structure.setValueSetBinding(this.compareValueSetBinding(source.getData().getBinding(),target.getData().getBinding()));

    this.compareBindings(structure, source.getData().getBinding() ,target.getData().getBinding());

    this.compare(structure, (Field) source.getData(), (Field) target.getData());
    structure.setChildren(this.compareComponents(source.getChildren(), target.getChildren()));
  }

//  private void compare(StructureDelta structure, ConformanceStatement source, ConformanceStatement target) {
//    structure.setType(Type.CONFORMANCESTATEMENT);
//
//    ConformanceStatementDelta delta = new ConformanceStatementDelta();
//    delta.setAction(DeltaAction.UNCHANGED);
//    delta.setDescription(this.compare(source.generateDescription(), target.generateDescription()));
//    delta.setIdentifier(this.compare(source.getIdentifier(), target.getIdentifier()));
//    System.out.println(source.getIdentifier());
//    System.out.println(target.getIdentifier());
//    structure.setConformanceStatement(delta);
//    List<StructureDelta> deltas = new ArrayList<>();
//    structure.setChildren(deltas);
//
//  }

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
    return this.compare(source, target, (s, t) -> {
      return s.getVersion().equals(t.getVersion()) && s.getScope().equals(t.getScope());
    });
  }

  private DeltaNode<String> compare(String source, String target) {
    return this.compare(source, target,
        (elm) -> {
          return elm != null && !elm.equals("NA") && !elm.equals("");
        },
        (s, t) -> {
          return s.equals(t);
        });
  }

  private DeltaNode<Usage> compare(Usage source, Usage target) {
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
  }

  private DeltaNode<List<String>> compare(List<String> source, List<String> target) {
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
  }


  private DeltaNode<CodeUsage> compare(CodeUsage source, CodeUsage target) {
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
  }

  private DeltaNode<Integer> compare(int source, int target) {
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
  }

  private <T> DeltaNode<T> compare(T source, T target, BiFunction<T, T, Boolean> f) {
    return this.compare(source, target, (a) -> {
      return a != null;
    }, f);
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
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
  }

  private DeltaNode<Extensibility> compare(Extensibility source, Extensibility target) {
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
  }

  private DeltaNode<ContentDefinition> compare(ContentDefinition source, ContentDefinition target) {
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
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
      }else {
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
            structure.setInternalSingleCode(this.compareInternalSingleCodes(new InternalSingleCode() , target.getInternalSingleCode()));
            structure.getValueSetBinding().setAction(DeltaAction.ADDED);
            structure.getInternalSingleCode().setAction(DeltaAction.DELETED);
          }
        }
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
    
    return  delta;

  }
  
  

  
  public DeltaInternalSingleCode compareInternalSingleCodes(InternalSingleCode source, InternalSingleCode target) {


    DeltaInternalSingleCode delta = new DeltaInternalSingleCode();
    delta.setAction(DeltaAction.UNCHANGED);
    DisplayElement vsSourceDisplay = null;
    DisplayElement vsTargetDisplay = null;
    if(source != null && target != null) {
      if(source.getValueSetId() !=null) {
        Valueset vs =  this.valueSetService.findById(source.getValueSetId());
        if(vs !=null) {
          vsSourceDisplay = new DisplayElement();

          vsSourceDisplay.setVariableName(vs.getBindingIdentifier());
          vsSourceDisplay.setId(vs.getId());
          vsSourceDisplay.setDomainInfo(vs.getDomainInfo());
        }
       }
       if(target.getValueSetId() !=null) {
         Valueset vs =  this.valueSetService.findById(target.getValueSetId());
         if(vs !=null) {
           vsTargetDisplay = new DisplayElement();
           vsTargetDisplay.setVariableName(vs.getBindingIdentifier());
           vsTargetDisplay.setId(vs.getId());
           vsTargetDisplay.setDomainInfo(vs.getDomainInfo());        
         }
        }
      
      DeltaNode<DisplayElement> valueSetDisplay = this.compare(vsSourceDisplay, vsTargetDisplay);
    
      delta.setValueSetDisplay(valueSetDisplay);

      DeltaNode<String> code = this.compare(source.getCode(), target.getCode());
      delta.setCode(code);

      DeltaNode<String> codeSystem = this.compare(source.getCodeSystem(), target.getCodeSystem());
      delta.setCodeSystem(codeSystem);
    }

    return  delta;
  }

  /**
   * @param vsSourceDisplay
   * @param vsTargetDisplay
   * @return
   */
  private DeltaNode<DisplayElement> compare(DisplayElement vsSourceDisplay,
      DisplayElement vsTargetDisplay) {
    // TODO Auto-generated method stub
    return this.compare(vsSourceDisplay, vsTargetDisplay, (s, t) -> {
      
      return  vsSourceDisplay.getVariableName().equals(vsTargetDisplay.getVariableName());
    });
  }

  public DeltaValuesetBinding compareValueSetBinding(Set<DisplayValuesetBinding> source, Set<DisplayValuesetBinding> target) {


    DeltaValuesetBinding delta = new DeltaValuesetBinding();
    delta.setAction(DeltaAction.UNCHANGED);

    if(source != null && target != null) {

      DisplayValuesetBinding sourceBindingDisplay = source.stream().findFirst().orElse(null);
      DisplayValuesetBinding targetBindingDisplay = target.stream().findFirst().orElse(null);
      if(sourceBindingDisplay != null && targetBindingDisplay != null ){
        DeltaNode<List<DisplayElement>> valueSets = this.compareDisplay(sourceBindingDisplay.getValueSetsDisplay(), targetBindingDisplay.getValueSetsDisplay());
        DeltaNode<ValuesetStrength> strength = this.compare(sourceBindingDisplay.getStrength(), targetBindingDisplay.getStrength());
        delta.setStrength(strength);

        DeltaNode<Set<Integer>> valuesetLocations = this.compare(sourceBindingDisplay.getValuesetLocations(), targetBindingDisplay.getValuesetLocations());
        delta.setValuesetLocations(valuesetLocations);
        delta.setValueSets(valueSets);
      }else if (targetBindingDisplay ==null) {
        if(sourceBindingDisplay !=null) {
 
        delta.setAction(DeltaAction.UPDATED);
        DeltaNode<List<DisplayElement>> valueSets = new DeltaNode<List<DisplayElement>>();
        valueSets.setAction(DeltaAction.UPDATED);
        valueSets.setPrevious(sourceBindingDisplay.getValueSetsDisplay());
        delta.setAction(DeltaAction.UPDATED);
        delta.setValueSets(valueSets);
        DeltaNode<ValuesetStrength> strength = this.compare(sourceBindingDisplay.getStrength(), null);
        delta.setStrength(strength);

        DeltaNode<Set<Integer>> valuesetLocations = this.compare(sourceBindingDisplay.getValuesetLocations(), null);
        delta.setValuesetLocations(valuesetLocations);
        }

      } else if (sourceBindingDisplay ==null) {
        if(targetBindingDisplay !=null) {
        DeltaNode<List<DisplayElement>> valueSets = new DeltaNode<List<DisplayElement>>();
        valueSets.setCurrent(targetBindingDisplay.getValueSetsDisplay());
        valueSets.setAction(DeltaAction.UPDATED);
        delta.setAction(DeltaAction.UPDATED);
        delta.setValueSets(valueSets);
        DeltaNode<ValuesetStrength> strength = this.compare(null, targetBindingDisplay.getStrength());
        delta.setStrength(strength);

        DeltaNode<Set<Integer>> valuesetLocations = this.compare(null, targetBindingDisplay.getValuesetLocations());
        delta.setValuesetLocations(valuesetLocations);
        }
      }
   

    }

    return  delta;
  }


  /**
   * @param valueSetsDisplay
   * @param valueSetsDisplay2
   * @return
   */
  private DeltaNode<List<DisplayElement>> compareDisplay(List<DisplayElement> source,
      List<DisplayElement> target) {
    // TODO Auto-generated method stub
    return this.compare(source, target, (s, t) -> {
      return this.compareListOfBinding(source,target );
    });
  }

  /**
   * @param source
   * @param target
   * @return
   */
  private Boolean compareListOfBinding(List<DisplayElement> source, List<DisplayElement> target) {
    // TODO Auto-generated method stub

    Map<String, DisplayElement> sourceMap = source.stream().collect(Collectors.toMap(x -> getUnicityKey(x) , x-> x));
    Map<String, DisplayElement> targetMap = source.stream().collect(Collectors.toMap(x -> getUnicityKey(x) , x-> x));

    Boolean equals = true;
    for(DisplayElement element : source) {
      String key = getUnicityKey(element);
      if(targetMap.containsKey(key)){
        element.setDelta(DeltaAction.UNCHANGED);
      }else {
        element.setDelta(DeltaAction.DELETED);
        equals = false;

      }
    }
    for(DisplayElement element : target) {
      String key = getUnicityKey(element);
      if(sourceMap.containsKey(key)){
        element.setDelta(DeltaAction.UNCHANGED);
      }else {
        element.setDelta(DeltaAction.ADDED);
        equals = false;
      }
    }
    return equals;

  }

  //
  //    /**
  //     * @param valueSetsDisplay
  //     * @param valueSetsDisplay2
  //     * @return
  //     */
  //    private DeltaNode<List<DisplayElement>> compareDisplay(List<DisplayElement> source,
  //        List<DisplayElement> target) {
  //      // TODO Auto-generated method stub
  //    
  //        return this.compareListOfBinding(source,target );
  // 
  //    }
  //
  //    /**
  //     * @param source
  //     * @param target
  //     * @return
  //     */
  //    private  DeltaNode<List<DisplayElement>> compareListOfBinding(List<DisplayElement> source, List<DisplayElement> target) {
  //      // TODO Auto-generated method stub
  //      Map<String, DisplayElement> sourceMap = source.stream().collect(Collectors.toMap(x -> getUnicityKey(x) , x-> x));
  //      Map<String, DisplayElement> targetMap = source.stream().collect(Collectors.toMap(x -> getUnicityKey(x) , x-> x));
  //      
  //      DeltaNode<List<DisplayElement>> node = new DeltaNode<>();
  //      DeltaAction action = DeltaAction.UNCHANGED;
  //      node.setAction(action);
  //      node.setCurrent(target);
  //      node.setPrevious(source);
  //
  //      for(DisplayElement element : source) {
  //        if(element.getVariableName().equals("HL70361")) {
  //          System.out.println("HERE");
  //        }
  //        String key = getUnicityKey(element);
  //        if(targetMap.containsKey(key)){
  //          element.setDelta(DeltaAction.UNCHANGED);
  //        }else {
  //          element.setDelta(DeltaAction.DELETED);
  //          node.setAction(DeltaAction.UPDATED);
  //        }
  //      }
  //      
  //      for(DisplayElement element : target) { 
  //        String key = getUnicityKey(element);
  //        if(sourceMap.containsKey(key)){
  //          element.setDelta(DeltaAction.UNCHANGED);
  //        }else {
  //          element.setDelta(DeltaAction.ADDED);
  //          node.setAction(DeltaAction.UPDATED);
  //
  //        }
  //      }
  //      return node;
  //     
  //    }
  private String getUnicityKey(DisplayElement element) {
    String ret = element.getVariableName();
    if(element.getDomainInfo() !=null && element.getDomainInfo().getVersion() !=null) {
      ret += element.getDomainInfo().getVersion();
    }
    return ret;
  }

  private DeltaNode<ValuesetStrength> compare(ValuesetStrength source, ValuesetStrength target) {
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
  }

  private DeltaNode<Set<Integer>> compare(Set<Integer> source, Set<Integer> target) {
    return this.compare(source, target, (s, t) -> {
      return s.equals(t);
    });
  }

  public List<StructureDelta> compareDateAndTimeDatatypes(DateTimeDatatype source, DateTimeDatatype target) {
    // TODO Auto-generated method
    List<StructureDelta> deltas= new ArrayList<StructureDelta>();
    Map<Integer , DateTimeComponentDefinition>  sourceMap = source.getDateTimeConstraints().getDateTimeComponentDefinitions().stream().collect(Collectors.toMap(x -> x.getPosition()  , x -> x));
    Map<Integer , DateTimeComponentDefinition>  targetMap= target.getDateTimeConstraints().getDateTimeComponentDefinitions().stream().collect(Collectors.toMap(x -> x.getPosition()  , x -> x));
    for(DateTimeComponentDefinition component: source.getDateTimeConstraints().getDateTimeComponentDefinitions()) {
      if(targetMap.containsKey(component.getPosition())) {
        deltas.add(this.compare(component, targetMap.get(component.getPosition())));
      }else {
        deltas.add( this.compare(component, null));
      }
    }
    for(DateTimeComponentDefinition component: target.getDateTimeConstraints().getDateTimeComponentDefinitions()) {
      if(!targetMap.containsKey(component.getPosition())) {
        deltas.add( this.compare(null, component));
      }
    }

    return deltas;
  }

  /**
   * @param component
   * @param dateTimeComponentDefinition
   * @return
   */
  private StructureDelta compare(DateTimeComponentDefinition source,
      DateTimeComponentDefinition target) {
    // TODO Auto-generated method stub
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
