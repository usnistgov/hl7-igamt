package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.*;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
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
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class EntityDeltaServiceImpl {

    public List<StructureDelta> datatype(DatatypeStructureDisplay source, DatatypeStructureDisplay target) {
        return this.compareComponents(source.getStructure(), target.getStructure());
    }

    public List<StructureDelta> segment(SegmentStructureDisplay source, SegmentStructureDisplay target) {
        return this.compareFields(source.getStructure(), target.getStructure());
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
        structure.setValueSetBinding(this.compare(
                this.getValueSetBinding(source.getData().getBindings()),
                this.getValueSetBinding(target.getData().getBindings())
        ));
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
        structure.setValueSetBinding(this.compare(
                this.getValueSetBinding(source.getData().getBindings()),
                this.getValueSetBinding(target.getData().getBindings())
        ));
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
        structure.setValueSetBinding(this.compare(
                this.getValueSetBinding(source.getData().getBindings()),
                this.getValueSetBinding(target.getData().getBindings())
         ));
        this.compare(structure, (Field) source.getData(), (Field) target.getData());
        structure.setChildren(this.compareComponents(source.getChildren(), target.getChildren()));
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
        structure.setValueSetBinding(this.compare(
                this.getValueSetBinding(source.getData().getBindings()),
                this.getValueSetBinding(target.getData().getBindings())
        ));
        this.compare(structure, (MsgStructElement) source.getData(), (MsgStructElement) target.getData());
        structure.setChildren(this.compareFields(source.getChildren(), target.getChildren()));
    }

    private void compare(StructureDelta structure, GroupStructureTreeModel source, GroupStructureTreeModel target) {
        structure.setType(source.getData().getType());
        structure.setValueSetBinding(this.compare(
                this.getValueSetBinding(source.getData().getBindings()),
                this.getValueSetBinding(target.getData().getBindings())
        ));
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

    private Set<DisplayValuesetBinding> getValueSetBinding(Set<BindingDisplay> bindings) {
        if(bindings != null) {
             Optional<BindingDisplay> bindingDisplay = bindings.stream().sorted((a, b) -> {
                return a.getPriority() - b.getPriority();
            }).filter((binding) -> {
                return binding.getValuesetBindings() != null && binding.getValuesetBindings().size() > 0;
             }).findFirst();

             if(bindingDisplay.isPresent()) {
                 return bindingDisplay.get().getValuesetBindings();
             }
        }
        return new HashSet<>();
    }

    private DeltaValueSetBinding compare(Set<DisplayValuesetBinding> source, Set<DisplayValuesetBinding> target) {

        DeltaValueSetBinding delta = new DeltaValueSetBinding();
//        Set<DisplayValuesetBinding> unchanged = source.stream().filter((vs) -> {
//            return target.stream().filter((tVs) -> tVs.getValuesetId().equals(vs.getValuesetId()) && tVs.getStrength().equals(vs.getStrength()) && tVs.getValuesetLocations().equals(vs.getValuesetLocations())).findFirst().isPresent();
//        }).collect(Collectors.toSet());
//        Set<DisplayValuesetBinding> updated = source.stream().filter((vs) -> {
//            return target.stream().filter((tVs) -> tVs.getValuesetId().equals(vs.getValuesetId()) && (!tVs.getStrength().equals(vs.getStrength()) || !tVs.getValuesetLocations().equals(vs.getValuesetLocations()))).findFirst().isPresent();
//        }).collect(Collectors.toSet());
//        Set<DisplayValuesetBinding> deleted = source.stream().filter((vs) -> {
//            return !target.stream().filter((tVs) -> tVs.getLabel().equals(vs.getLabel())).findFirst().isPresent();
//        }).collect(Collectors.toSet());
//        Set<DisplayValuesetBinding> added = target.stream().filter((vs) -> {
//            return !source.stream().filter((tVs) -> tVs.getLabel().equals(vs.getLabel())).findFirst().isPresent();
//        }).collect(Collectors.toSet());
//
//        delta.setRemoved(deleted);
//        delta.setUnchanged(unchanged);
//        delta.setAdded(added);
//        delta.setUpdated(updated);

        return  delta;
    }
}
