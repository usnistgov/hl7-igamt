package gov.nist.hit.hl7.igamt.common.base.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.GenerationDirective;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

import java.util.HashSet;
import java.util.Set;

public class GeneratedResourceMetadata<T extends Resource> {
    private String profileComponentId;
    private boolean resourceRoot;
    private String sourceId;
    private Class<T> type;
    private String generatedResourceId;
    private Set<GenerationDirective> generatedUsing;
    private int useCount;
    private String directiveId;

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
}
