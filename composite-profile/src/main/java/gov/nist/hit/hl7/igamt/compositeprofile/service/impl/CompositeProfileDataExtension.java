package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.GenerationDirective;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataExtension;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.GeneratedResourceMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

import java.io.IOException;
import java.util.*;

public class CompositeProfileDataExtension extends DataExtension {
    List<GeneratedResourceMetadata> generatedResourceMetadataList = new ArrayList<>();

    void prune(String ext) {
        Map<String, Integer> extensionCounts = new HashMap<>();

        for(GeneratedResourceMetadata rmd: this.generatedResourceMetadataList) {
            Resource resource = this.get(rmd.getGeneratedResourceId(), rmd.getType());
            resource.setGenerated(true);
            resource.setGeneratedUsing(rmd.getGeneratedUsing());
            resource.getDomainInfo().setScope(Scope.USER);
            String baseResourceIdentifier = this.getUniqueBaseResourceIdentifier(resource);
            int index = extensionCounts.getOrDefault(baseResourceIdentifier, 1);
            String prunedExt = ext + '_' + index;
            extensionCounts.put(baseResourceIdentifier, index + 1);
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

    public GeneratedResourceMetadata getResourceMetadata(Resource source) {
        return getResourceMetadata(source.getId());
    }

    public GeneratedResourceMetadata getResourceMetadata(String id) {
        return this.generatedResourceMetadataList
                .stream()
                .filter((md) ->
                                md.getGeneratedResourceId().equals(id)
                )
                .findAny()
                .orElse(null);
    }

    public <T extends Resource> String getUniqueBaseResourceIdentifier(T resource) {
        StringBuilder builder = new StringBuilder();
        builder.append(resource.getName());
        if(!Strings.isNullOrEmpty(resource.getFixedExtension())) {
            builder.append("_").append(resource.getFixedExtension());
        }
        builder.append("_").append(resource.getDomainInfo().getVersion().replace('.', '-'));
        return  builder.toString();
    }

    // Used to reduce the amount of created flavors, if an existing flavor for this directive & resource combination exists use it instead
    public <T extends Resource> GeneratedResourceMetadata findFlavorCreatedByDirectiveForSource(T source, GenerationDirective directive) {
	    return this.generatedResourceMetadataList.stream().filter((rmd) -> {
	        boolean targetMatch = rmd.getSourceId().equals(source.getId());
	        boolean directiveMatch = rmd.getGeneratedUsing().size() == 1 && rmd.getGeneratedUsing().get(0).equals(directive);
	        return targetMatch && directiveMatch && rmd.isProfileComponentContextRootFlavor();
	    }).findAny().orElse(null);
    }

    public <T extends Resource> T createFlavor(T source, GenerationDirective directive, String elementPath) throws IOException {
        GeneratedResourceMetadata rmd = this.getResourceMetadata(source);
        boolean sourceIsNotGeneratedFlavor = rmd == null;
        if(sourceIsNotGeneratedFlavor) {
            GeneratedResourceMetadata existing = findFlavorCreatedByDirectiveForSource(source, directive);
            if(existing != null) {
                // Add elementPath to the existing flavor usage
                existing.getMessageUsagePaths().add(elementPath);
                return (T) get(existing.getGeneratedResourceId(), existing.getType());
            }
        }

        T cloned = InMemoryDomainExtensionServiceImpl.clone(source);
        String flavorId = UUID.randomUUID().toString();
        cloned.setId(flavorId);
        cloned.setFrom(source.getId());
        cloned.setOrigin(source.getOrigin());
        GeneratedResourceMetadata generatedResourceMetadata = new GeneratedResourceMetadata();
        generatedResourceMetadata.setSourceId(rmd == null ? source.getId() : rmd.getSourceId());
        generatedResourceMetadata.setType(source.getClass());
        generatedResourceMetadata.setGeneratedResourceId(flavorId);
        List<GenerationDirective> generatedUsing = rmd == null ? new ArrayList<>() : new ArrayList<>(rmd.getGeneratedUsing());
        generatedUsing.add(directive);
        generatedResourceMetadata.setGeneratedUsing(generatedUsing);
        generatedResourceMetadata.setProfileComponentContextRootFlavor(
                sourceIsNotGeneratedFlavor && directive.getContextType().equals(Type.SEGMENT)
        );
        generatedResourceMetadata.getMessageUsagePaths().add(elementPath);
        this.generatedResourceMetadataList.add(generatedResourceMetadata);
        put(cloned);
        if(rmd != null) {
            // If source is a generated flavor, remove the elementPath from its usage since it has been replaced in this element
            rmd.getMessageUsagePaths().remove(elementPath);

            // If flavor is not used anywhere, remove it
            if(rmd.getMessageUsagePaths().isEmpty()) {
                this.generatedResourceMetadataList.remove(rmd);
                this.remove(rmd.getGeneratedResourceId(), rmd.getType());
            }
        }
        return cloned;
    }

    public <T extends Resource> T getResource(String id, Class<T> type) {
        GeneratedResourceMetadata rmd = getResourceMetadata(id);
        if(rmd != null) {
            Resource resource = this.get(id, rmd.getType());
            if(type.isAssignableFrom(rmd.getType())) {
                return (T) resource;
            } else {
                return null;
            }
        }
        return null;
    }
}
