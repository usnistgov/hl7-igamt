package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.nist.hit.hl7.igamt.common.base.domain.GenerationDirective;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class GeneratedResourceMetadata {
    private String sourceId;
    @JsonIgnore
    private Class<? extends Resource> type;
    private String generatedResourceId;
    private boolean profileComponentContextRootFlavor;
    private List<GenerationDirective> generatedUsing = new ArrayList<>();
    private Set<String> messageUsagePaths = new HashSet<>();

    public GeneratedResourceMetadata() {
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getGeneratedResourceId() {
        return generatedResourceId;
    }

    public void setGeneratedResourceId(String generatedResourceId) {
        this.generatedResourceId = generatedResourceId;
    }

    public Class<? extends Resource> getType() {
        return type;
    }

    public void setType(Class<? extends Resource> type) {
        this.type = type;
    }

    public List<GenerationDirective> getGeneratedUsing() {
        return generatedUsing;
    }

    public void setGeneratedUsing(List<GenerationDirective> generatedUsing) {
        this.generatedUsing = generatedUsing;
    }

    public boolean isProfileComponentContextRootFlavor() {
        return profileComponentContextRootFlavor;
    }

    public void setProfileComponentContextRootFlavor(boolean profileComponentContextRootFlavor) {
        this.profileComponentContextRootFlavor = profileComponentContextRootFlavor;
    }

    public Set<String> getMessageUsagePaths() {
        return messageUsagePaths;
    }


}
