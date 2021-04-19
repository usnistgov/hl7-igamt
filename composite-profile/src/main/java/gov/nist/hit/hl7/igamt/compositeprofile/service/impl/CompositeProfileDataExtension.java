package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataExtension;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.GeneratedResourceMetadata;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

public class CompositeProfileDataExtension extends DataExtension {
    List<GeneratedResourceMetadata> generatedResourceMetadataList = new ArrayList<>();

    void prune(String ext) {
        Map<String, Integer> extCount = new HashMap<>();

        for(GeneratedResourceMetadata rmd: this.generatedResourceMetadataList) {
            Resource resource = this.get(rmd.getGeneratedResourceId(), rmd.getType());
            resource.setGenerated(true);
            resource.setGeneratedUsing(rmd.getGeneratedUsing());
            resource.getDomainInfo().setScope(Scope.USER);
            String id = this.getResourceId(resource, ext);
            int index = extCount.containsKey(id) ? extCount.get(this.getResourceId(resource, ext)) : 1;
            String prunedExt = ext + '_' + index;
            extCount.put(id, index + 1);
            if(resource instanceof Datatype) {
                this.setDatatypeExt((Datatype) resource, prunedExt);
            }
            if(resource instanceof Segment) {
                this.setSegmentExt((Segment) resource, prunedExt);
            }
        }
    }

    void setDatatypeExt(Datatype datatype, String ext) {
        datatype.setExt(ext);
    }

    void setSegmentExt(Segment segment, String ext) {
        segment.setExt(ext);
    }

    public <T extends Resource> void setChanges(T source, String elementId, Set<ItemProperty> properties) {
        this.generatedResourceMetadataList
                .stream()
                .filter((elm) -> elm.getGeneratedResourceId().equals(source.getId()))
                .findFirst()
                .map((elm) -> {
                    Map<String, Map<PropertyType, ItemProperty>> changes = elm.getChanges();
                    if(changes == null) {
                        changes = new HashMap<>();
                    }
                    Map<PropertyType, ItemProperty> props = properties
                            .stream()
                            .collect(Collectors
                            .groupingBy(ItemProperty::getPropertyKey, Collectors.reducing(null, (a, b) -> b)));

                    changes.merge(elementId, props, (ov, nv) -> {
                        ov.putAll(nv);
                        return ov;
                    });

                    elm.setChanges(changes);

                    return elm;
                });
    }

    public <T extends Resource> boolean isGeneratedFrom(T source, String id) {
        return source.getId().equals(id) || this.generatedResourceMetadataList
                .stream()
                .anyMatch((md) ->
                        md.getGeneratedResourceId().equals(source.getId()) &&
                        md.getSourceId().equals(id) &&
                        md.isResourceRoot() &&
                        md.getType().equals(source.getClass())
                );
    }

    public <T extends Resource> void replace(GeneratedResourceMetadata<T> target, GeneratedResourceMetadata<T> by) {
        if(target != null) {
            this.decrementUsage(target);
        }
        this.incrementUsage(by);
    }

    public void incrementUsage(GeneratedResourceMetadata<?> target) {
        this.generatedResourceMetadataList
                .stream()
                .filter((rmd) -> rmd.getDirectiveId().startsWith(target.getDirectiveId()))
                .forEach((rmd) -> rmd.setUseCount(rmd.getUseCount() + 1));
    }

    public void decrementUsage(GeneratedResourceMetadata<?> target) {
        List<GeneratedResourceMetadata> removable = this.generatedResourceMetadataList
                .stream()
                .filter((rmd) -> rmd.getDirectiveId().equals(target.getDirectiveId()))
                .peek((rmd) -> rmd.setUseCount(rmd.getUseCount() - 1))
                .filter((rmd) -> rmd.getUseCount() == 0)
                .collect(Collectors.toList());
        removable.forEach((rmd) -> this.remove(rmd.getGeneratedResourceId(), rmd.getType()));
        this.generatedResourceMetadataList.removeAll(removable);
    }

    public <T extends Resource> T swap(
            GeneratedResourceMetadata<T> existing,
            String pcId,
            String directiveId,
            T source,
            boolean root
    ) {
        String sourceId = existing != null ? existing.getSourceId() : source.getId();
        GeneratedResourceMetadata<T> flavor = new GeneratedResourceMetadata<T>(
                pcId,
                directiveId,
                root,
                sourceId,
                (Class<T>) source.getClass(),
                this.getResourceId(source, UUID.randomUUID().toString()),
                0,
                existing
        );
        this.generatedResourceMetadataList.add(flavor);
        this.replace(existing, flavor);
        return this.createFlavor(source, flavor);
    }

    public <T extends Resource> T getPcRootFlavor(String pcId, String targetId, T source) {
        // Profile Component Flavor
        GeneratedResourceMetadata<T> existingDirectiveFlavor = this.generatedResourceMetadataList
                .stream()
                .filter((md) ->
                                md.getProfileComponentId().equals(pcId) &&
                                md.getSourceId().equals(targetId) &&
                                md.isResourceRoot() &&
                                md.getType().equals(source.getClass())
                )
                .findAny()
                .orElse(null);

        // No Flavor for PC has been created
        if(existingDirectiveFlavor != null) {
            this.replace(this.getResourceMetadata(source), existingDirectiveFlavor);
            return (T) this.get(existingDirectiveFlavor.getGeneratedResourceId(), source.getClass());
        } else {
            return null;
        }
    }


    public <T extends Resource> T getOrCreatePcRootFlavor(String pcId, String directiveId, String targetId, T source) {
        // Profile Component Flavor
        GeneratedResourceMetadata<?> existingDirectiveFlavor = this.generatedResourceMetadataList
                .stream()
                .filter((md) ->
                        md.getProfileComponentId().equals(pcId) &&
                        md.getSourceId().equals(targetId) &&
                        md.isResourceRoot() &&
                        md.getType().equals(source.getClass())
                )
                .findAny()
                .orElse(null);

        // No Flavor for PC has been created
        if(existingDirectiveFlavor == null) {
            return this.swap(pcId, directiveId, source, true);
        } else {
            this.incrementUsage(existingDirectiveFlavor);
            return (T) this.get(existingDirectiveFlavor.getGeneratedResourceId(), source.getClass());
        }
    }

    public <T extends Resource> T swap(String pcId, String directiveId, T source) {
        return this.swap(pcId, directiveId, source, false);
    }

    public <T extends Resource> GeneratedResourceMetadata<T> getResourceMetadata(T source) {
        return (GeneratedResourceMetadata<T>) this.generatedResourceMetadataList
                .stream()
                .filter((md) ->
                        md.getGeneratedResourceId().equals(source.getId()) &&
                                md.getType().equals(source.getClass())
                )
                .findAny()
                .orElse(null);
    }

    public <T extends Resource> T swap(String pcId, String directiveId, T source, boolean root) {
        GeneratedResourceMetadata<T> existing = this.getResourceMetadata(source);
        return this.swap(existing, pcId, directiveId, source, root);
    }

    public <T extends Resource> T createFlavor(T source, GeneratedResourceMetadata<T> rmd) {
        try {
            T clone = InMemoryDomainExtensionServiceImpl.clone(source);
            clone.setId(rmd.getGeneratedResourceId());
            this.put(clone);
            return clone;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }


    public <T extends Resource> String getResourceId(T resource, String flavorId) {
        return  resource.getName() + '_' + flavorId + '_' + resource.getDomainInfo().getVersion().replace('.', '-');
    }

}
