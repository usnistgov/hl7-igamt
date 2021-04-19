package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.nist.hit.hl7.igamt.common.base.domain.GenerationDirective;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class GeneratedResourceMetadata<T extends Resource> {
    private String profileComponentId;
    private boolean resourceRoot;
    private String sourceId;
    @JsonIgnore
    private Class<T> type;
    private String generatedResourceId;
    private Set<GenerationDirective> generatedUsing;
    private int useCount;
    private String directiveId;
    private Map<String, Map<PropertyType, ItemProperty>> changes;

    public GeneratedResourceMetadata() {
    }

    public GeneratedResourceMetadata(
            String profileComponentId,
            String directiveId,
            boolean resourceRoot,
            String sourceId,
            Class<T> type,
            String generatedResourceId,
            int useCount,
            GeneratedResourceMetadata from
    ) {
        this.profileComponentId = profileComponentId;
        this.resourceRoot = resourceRoot;
        this.sourceId = sourceId;
        this.type = type;
        this.generatedResourceId = generatedResourceId;
        this.useCount = useCount;
        if(from != null) {
            this.generatedUsing = new HashSet<>(from.generatedUsing);
            this.generatedUsing.add(new GenerationDirective(profileComponentId, this.generatedUsing.size() + 1, Type.PROFILECOMPONENT));
        } else {
            this.generatedUsing = new HashSet<>();
            this.generatedUsing.add(new GenerationDirective(profileComponentId, 1, Type.PROFILECOMPONENT));
        }
        this.directiveId = directiveId;
        this.changes = from != null ? this.cloneChanges(from.getChanges()) : new HashMap<>();
    }

    Map<String, Map<PropertyType, ItemProperty>> cloneChanges(Map<String, Map<PropertyType, ItemProperty>> map) {
        if(map != null) {
            return map.entrySet().stream()
                    .collect(
                            Collectors.toMap(Map.Entry::getKey, e -> e.getValue().entrySet().stream()
                                    .collect(
                                        Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)
                                    )
                            )
                    );
        } else {
            return null;
        }
    }


    public String getDirectiveId() {
        return directiveId;
    }

    public void setDirectiveId(String directiveId) {
        this.directiveId = directiveId;
    }

    public Set<GenerationDirective> getGeneratedUsing() {
        return generatedUsing;
    }

    public void setGeneratedUsing(Set<GenerationDirective> generatedUsing) {
        this.generatedUsing = generatedUsing;
    }

    public String getProfileComponentId() {
        return profileComponentId;
    }

    public void setProfileComponentId(String profileComponentId) {
        this.profileComponentId = profileComponentId;
    }

    public boolean isResourceRoot() {
        return resourceRoot;
    }

    public void setResourceRoot(boolean resourceRoot) {
        this.resourceRoot = resourceRoot;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public Class<T> getType() {
        return type;
    }

    public void setType(Class<T> type) {
        this.type = type;
    }

    public String getGeneratedResourceId() {
        return generatedResourceId;
    }

    public void setGeneratedResourceId(String generatedResourceId) {
        this.generatedResourceId = generatedResourceId;
    }

    public int getUseCount() {
        return useCount;
    }

    public void setUseCount(int useCount) {
        this.useCount = useCount;
    }

    public Map<String, Map<PropertyType, ItemProperty>> getChanges() {
        return changes;
    }

    public void setChanges(Map<String, Map<PropertyType, ItemProperty>> changes) {
        this.changes = changes;
    }
}
