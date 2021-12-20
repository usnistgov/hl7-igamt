package gov.nist.hit.hl7.igamt.coconstraints.service.impl;

import com.google.common.base.Strings;
import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.service.TriFunction;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Assertion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Service
public class CoConstraintDeltaService {

    @Autowired
    SimpleCoConstraintService coConstraintService;

    public void preProcess(List<CoConstraintBinding> bindings) {
        for(CoConstraintBinding binding: bindings) {
            for(CoConstraintBindingSegment coConstraintBindingSegment: binding.getBindings()) {
                for(CoConstraintTableConditionalBinding coConstraintTableConditionalBinding: coConstraintBindingSegment.getTables()) {
                    coConstraintTableConditionalBinding.setValue(this.coConstraintService.resolveRefAndMerge(coConstraintTableConditionalBinding.getValue()));
                }
            }
        }
    }

    public <T extends WithDelta> List<T> matchAndTransform(List<T> source, List<T> target, TriFunction<T, Integer, List<T>, Optional<T>> match, BiFunction<T, T, T> transform) {
        List<T> matched = IntStream.range(0, source.size()).mapToObj((i) -> {
            T s = source.get(i);
            Optional<T> m = match.apply(s, i, target);
            m.ifPresent(target::remove);
            return this.doDelta(Optional.of(s),m, transform);
        }).collect(Collectors.toList());

        List<T> targetLeft = target
                .stream()
                .map((t) -> this.doDelta(Optional.empty(), Optional.of(t), transform))
                .collect(Collectors.toList());

        return Stream.concat(
                matched.stream(),
                targetLeft.stream()
        ).collect(Collectors.toList());
    }

    public <T extends WithDelta> T doDelta(Optional<T> source, Optional<T> target, BiFunction<T, T, T> transform) {
        Optional<T> addedOrDeleted = this.addedOrDeleted(source, target);
        return addedOrDeleted.orElseGet(() -> transform.apply(source.get(), target.get()));
    }

    public <T extends WithDelta> Optional<T> addedOrDeleted(Optional<T> source, Optional<T> target) {
        if(!target.isPresent() && !source.isPresent()) {
            throw new IllegalArgumentException("Source and Target not present");
        }

        if(!source.isPresent()) {
            T added = target.get();
            added.setDelta(DeltaAction.ADDED);
            return Optional.of(added);
        }

        if(!target.isPresent()) {
            T deleted = source.get();
            deleted.setDelta(DeltaAction.DELETED);
            return Optional.of(deleted);
        }

        return Optional.empty();
    }

    public <T extends WithDelta> boolean hasChange(List<T> list) {
        return list.stream().anyMatch((d) ->
                        DeltaAction.ADDED.equals(d.getDelta()) ||
                        DeltaAction.DELETED.equals(d.getDelta()) ||
                        DeltaAction.CHANGED.equals(d.getDelta())
        );
    }

    public <T extends WithDelta> TriFunction<T, Integer, List<T>, Optional<T>> getMatchFactory(BiFunction<T, T, Boolean> matcher) {
        return (candidate, i, list) -> list.stream().filter((t) -> matcher.apply(candidate, t)).findAny();
    }


    public  <T extends WithDelta> Optional<T> getMatchByPosition(T candidate, Integer i, List<T> list) {
        if(list.size() > i) {
            return Optional.of(list.get(i));
        } else {
            return Optional.empty();
        }
    }

    public CoConstraintGroup deltaGroup(CoConstraintGroup source, CoConstraintGroup target) {
        List<CoConstraint> coConstraints = this.matchAndTransform(source.getCoConstraints(), target.getCoConstraints(), this.getMatchFactory(this::match), this::deltaCoConstraint);
        DeltaField<String> deltaName = this.deltaName(source.getName(), target.getName());
        CoConstraintGrouper grouper = this.deltaCoConstraintGrouper(source.getHeaders().getGrouper(), target.getHeaders().getGrouper());
        target.setCoConstraints(coConstraints);
        target.getHeaders().setGrouper(grouper);
        target.setNameDelta(deltaName);
        target.setDelta(this.hasChange(coConstraints) || this.hasChange(Collections.singletonList(grouper)) || !target.getNameDelta().getDelta().equals(DeltaAction.UNCHANGED) ? DeltaAction.CHANGED : DeltaAction.UNCHANGED);
        return target;
    }

    public List<CoConstraintBinding> delta(List<CoConstraintBinding> source, List<CoConstraintBinding> target) {
        return this.matchAndTransform(source, target, this.getMatchFactory(this::match), this::deltaBinding);
    }

    public CoConstraintBinding deltaBinding(CoConstraintBinding source, CoConstraintBinding target) {
        List<CoConstraintBindingSegment> transformed = this.matchAndTransform(source.getBindings(), target.getBindings(), this.getMatchFactory(this::match), this::deltaBindingSegment);
        target.setDelta(this.hasChange(transformed) ? DeltaAction.CHANGED : DeltaAction.UNCHANGED);
        target.setBindings(transformed);
        return target;
    }

    public CoConstraintBindingSegment deltaBindingSegment(CoConstraintBindingSegment source, CoConstraintBindingSegment target) {
        List<CoConstraintTableConditionalBinding> transformed = this.matchAndTransform(source.getTables(), target.getTables(), this::getMatchByPosition, this::deltaBindingConditional);
        target.setNameDelta(this.deltaName(source.getName(), target.getName()));
        target.setDelta(this.hasChange(transformed) || !target.getNameDelta().getDelta().equals(DeltaAction.UNCHANGED) ? DeltaAction.CHANGED : DeltaAction.UNCHANGED);
        target.setTables(transformed);
        return target;
    }

    public CoConstraintTableConditionalBinding deltaBindingConditional(CoConstraintTableConditionalBinding source, CoConstraintTableConditionalBinding target) {
        CoConstraintTable deltaTable = this.deltaCoConstraintTable(source.getValue(), target.getValue());
        target.setConditionDelta(this.deltaAssertion(source.getCondition(), target.getCondition()));
        target.setDelta(
                !deltaTable.getDelta().equals(DeltaAction.UNCHANGED) ||
                        !target.getConditionDelta().getDelta().equals(DeltaAction.UNCHANGED) ? DeltaAction.CHANGED : DeltaAction.UNCHANGED);
        target.setValue(deltaTable);
        return target;
    }

    public CoConstraintTable deltaCoConstraintTable(CoConstraintTable source, CoConstraintTable target) {
        List<CoConstraint> coConstraints = this.matchAndTransform(source.getCoConstraints(), target.getCoConstraints(), this.getMatchFactory(this::match), this::deltaCoConstraint);
        List<CoConstraintGroupBinding> groups = this.matchAndTransform(source.getGroups(), target.getGroups(), this.getMatchFactory(this::match), this::deltaCoConstraintGroupBinding);
        CoConstraintGrouper grouper = this.deltaCoConstraintGrouper(source.getHeaders().getGrouper(), target.getHeaders().getGrouper());
        boolean hasChanges = this.hasChange(coConstraints) || this.hasChange(groups) || this.hasChange(Collections.singletonList(grouper));
        target.setDelta(hasChanges ? DeltaAction.CHANGED : DeltaAction.UNCHANGED);
        target.setCoConstraints(coConstraints);
        target.setGroups(groups);
        target.getHeaders().setGrouper(grouper);
        return target;
    }

    public CoConstraintGrouper deltaCoConstraintGrouper(CoConstraintGrouper source, CoConstraintGrouper target) {
        if(source != null && target == null) {
            source.setDelta(DeltaAction.DELETED);
            source.setPathIdDelta(new DeltaField<>(source.getPathId(), null));
            return source;
        }

        if(source == null && target != null) {
            target.setDelta(DeltaAction.ADDED);
            target.setPathIdDelta(new DeltaField<>(null, target.getPathId()));
            return target;
        }

        if(source != null && target != null) {
            target.setDelta(DeltaAction.ADDED);
            target.setPathIdDelta(new DeltaField<>(source.getPathId(), target.getPathId()));

            boolean hasChanges = this.hasChange(Arrays.asList(
                    target.getPathIdDelta()
            ));
            target.setDelta(hasChanges ? DeltaAction.CHANGED : DeltaAction.UNCHANGED);
            return target;
        }

        return null;
    }

    public CoConstraint deltaCoConstraint(CoConstraint source, CoConstraint target) {
        target.setRequirement(this.deltaRequirement(source.getRequirement(), target.getRequirement()));
        target.setDelta(this.hasChange(target.getRequirement()) ? DeltaAction.CHANGED : DeltaAction.UNCHANGED);
        return target;
    }

    public CoConstraintGroupBinding deltaCoConstraintGroupBinding(CoConstraintGroupBinding source, CoConstraintGroupBinding target) {
        return this.deltaCoConstraintGroupBindingContained((CoConstraintGroupBindingContained) source, (CoConstraintGroupBindingContained) target);
    }

    public CoConstraintGroupBindingContained deltaCoConstraintGroupBindingContained(CoConstraintGroupBindingContained source, CoConstraintGroupBindingContained target) {
        List<CoConstraint> coConstraints = this.matchAndTransform(source.getCoConstraints(), target.getCoConstraints(), this.getMatchFactory(this::match), this::deltaCoConstraint);
        target.setRequirement(this.deltaRequirement(source.getRequirement(), target.getRequirement()));
        target.setNameDelta(this.deltaName(source.getName(), target.getName()));
        target.setDelta(this.hasChange(coConstraints) || this.hasChange(target.getRequirement()) || !target.getNameDelta().getDelta().equals(DeltaAction.UNCHANGED) ? DeltaAction.CHANGED : DeltaAction.UNCHANGED);
        target.setCoConstraints(coConstraints);
        return target;
    }

    public boolean hasChange(CoConstraintRequirement req) {
        if(req.getUsageDelta() != null && !req.getUsageDelta().getDelta().equals(DeltaAction.UNCHANGED)) {
            return true;
        }

        if(req.getCardinalityDelta() != null && !req.getCardinalityDelta().getDelta().equals(DeltaAction.UNCHANGED)) {
            return true;
        }

        return false;
    }


    public CoConstraintRequirement deltaRequirement(CoConstraintRequirement source, CoConstraintRequirement target) {
        target.setCardinalityDelta(this.deltaCardinality(source.getCardinality(), target.getCardinality()));
        target.setUsageDelta(this.deltaUsage(source.getUsage(), target.getUsage()));
        return target;
    }

    public DeltaField<CoConstraintUsage> deltaUsage(CoConstraintUsage source, CoConstraintUsage target) {
        return new DeltaField<>(source, target);
    }

    public DeltaField<CoConstraintCardinality> deltaCardinality(CoConstraintCardinality source, CoConstraintCardinality target) {
        return new DeltaField<>(source, target);
    }

    public DeltaField<String> deltaName(String source, String target) {
        return new DeltaField<>(source, target);
    }

    public DeltaField<String> deltaAssertion(Assertion source, Assertion target) {
        return new DeltaField<>(source != null ? source.getDescription() : null, target != null ? target.getDescription() : null);
    }


    boolean match(CoConstraintGroupBinding source, CoConstraintGroupBinding target) {
        boolean typeMatch = source.getType().equals(target.getType());
        if(typeMatch && !Strings.isNullOrEmpty(source.getId()) && !Strings.isNullOrEmpty(target.getId())) {
            return source.getId().equals(target.getId());
        }
        return false;
    }

    boolean match(CoConstraint source, CoConstraint target) {
        return source.getId().equals(target.getId());
    }

    boolean match(CoConstraintBindingSegment source, CoConstraintBindingSegment target) {
        return this.match(source.getSegment(), target.getSegment());
    }

    boolean match(CoConstraintBinding source, CoConstraintBinding target) {
        return this.match(source.getContext(), target.getContext());
    }

    boolean match(StructureElementRef source, StructureElementRef target) {
        return source.getPathId().equals(target.getPathId());
    }
}
