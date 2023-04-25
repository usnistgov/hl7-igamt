package gov.nist.hit.hl7.igamt.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.ig.binding.*;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SimpleResourceBindingService implements ResourceBindingService {

    @Autowired
    ResourceSkeletonService resourceSkeletonService;

    @Override
    public FlatResourceBinding getFlatResourceBindings(ResourceBinding resourceBinding) {
        FlatResourceBinding structResourceBindings = resourceBinding.getChildren() != null && resourceBinding.getChildren().size() > 0 ?
                resourceBinding.getChildren().stream()
                        .map((a) -> this.getResourceBindings(null, a))
                        .reduce(new FlatResourceBinding(), this::merge) : new FlatResourceBinding();

        if(resourceBinding.getConformanceStatements() != null) {
            structResourceBindings.setConformanceStatementBindingContainers(
                    resourceBinding.getConformanceStatements().stream().map(
                            (cs) -> new ConformanceStatementBindingContainer(
                                    cs.getId(), cs
                            )
                    ).collect(Collectors.toSet())
            );
        }
        return structResourceBindings;
    }

    @Override
    public FlatResourceBindingDisplay getFlatResourceBindingsDisplay(Resource resource, FlatResourceBinding bindings) {
        FlatResourceBindingDisplay display = new FlatResourceBindingDisplay();
        ResourceSkeleton skeleton = new ResourceSkeleton(
                new ResourceRef(resource.getType(), resource.getId()),
                this.resourceSkeletonService
        );
        display.setValueSetBindingContainers(
                getDisplay(skeleton, bindings.getValueSetBindingContainers())
        );
        display.setSingleCodeBindingContainers(
                getDisplay(skeleton, bindings.getSingleCodeBindingContainers())
        );
        display.setPredicateBindingContainers(
                getDisplay(skeleton, bindings.getPredicateBindingContainers())
        );
        display.setConformanceStatementBindingContainers(
                getDisplayWithoutLocationInfo(bindings.getConformanceStatementBindingContainers())
        );
        return display;
    }

    private <E extends BindingContainer<?>> Set<DisplayBindingContainer<E>> getDisplay(ResourceSkeleton skeleton, Set<E> containers) {
        return containers.stream().map((container) -> new DisplayBindingContainer<>(
                container,
                this.getLocationInfo(skeleton, container.getPathId())
        )).collect(Collectors.toSet());
    }

    private <E extends BindingContainer<?>> Set<DisplayBindingContainer<E>> getDisplayWithoutLocationInfo(Set<E> containers) {
        return containers.stream().map((container) -> new DisplayBindingContainer<>(
                container,
                null
        )).collect(Collectors.toSet());
    }

    private LocationInfo getLocationInfo(ResourceSkeleton skeleton, String pathId) {
        if(!Strings.isNullOrEmpty(pathId)) {
            try {
                ResourceSkeletonBone bone = skeleton.get(pathId);
                if(bone != null) {
                    return bone.getLocationInfo();
                }
            } catch (ResourceNotFoundException e) {
                return null;
            }
        }
        return null;
    }

    public FlatResourceBinding getResourceBindings(String parent, StructureElementBinding binding) {
        if(binding != null) {
            String pathId = Strings.isNullOrEmpty(parent) ? binding.getElementId() : parent + "-" + binding.getElementId();
            FlatResourceBinding flatResourceBinding = new FlatResourceBinding();
            if(binding.getPredicate() != null) {
                flatResourceBinding.setPredicateBindingContainers(
                        Collections.singleton(
                                new PredicateBindingContainer(pathId, binding.getPredicate())
                        )
                );
            }
            if(binding.getValuesetBindings() != null && binding.getValuesetBindings().size() > 0) {
                flatResourceBinding.setValueSetBindingContainers(
                        Collections.singleton(
                                new ValueSetBindingContainer(pathId, binding.getValuesetBindings())
                        )
                );
            }

            if(binding.getSingleCodeBindings() != null && binding.getSingleCodeBindings().size() > 0) {
                flatResourceBinding.setSingleCodeBindingContainers(
                        Collections.singleton(
                                new SingleCodeBindingContainer(pathId, binding.getSingleCodeBindings())
                        )
                );
            }

            if(binding.getChildren() != null && binding.getChildren().size() > 0) {
                return binding.getChildren().stream()
                        .map((a) -> this.getResourceBindings(pathId, a))
                        .reduce(flatResourceBinding, this::merge);
            } else {
                return flatResourceBinding;
            }
        } else {
            return new FlatResourceBinding();
        }
    }

    public FlatResourceBinding merge(FlatResourceBinding a, FlatResourceBinding b) {
        FlatResourceBinding merged = new FlatResourceBinding();
        merged.getConformanceStatementBindingContainers().addAll(a.getConformanceStatementBindingContainers());
        merged.getPredicateBindingContainers().addAll(a.getPredicateBindingContainers());
        merged.getSingleCodeBindingContainers().addAll(a.getSingleCodeBindingContainers());
        merged.getValueSetBindingContainers().addAll(a.getValueSetBindingContainers());

        merged.getConformanceStatementBindingContainers().addAll(b.getConformanceStatementBindingContainers());
        merged.getPredicateBindingContainers().addAll(b.getPredicateBindingContainers());
        merged.getSingleCodeBindingContainers().addAll(b.getSingleCodeBindingContainers());
        merged.getValueSetBindingContainers().addAll(b.getValueSetBindingContainers());

        return merged;
    }
}
