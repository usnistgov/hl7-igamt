package gov.nist.hit.hl7.igamt.workspace.model;

import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceAccessType;

public class WorkspaceCreateRequest {
    private String title;
    private String description;
    private WorkspaceAccessType accessType;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public WorkspaceAccessType getAccessType() {
        return accessType;
    }

    public void setAccessType(WorkspaceAccessType accessType) {
        this.accessType = accessType;
    }
}
