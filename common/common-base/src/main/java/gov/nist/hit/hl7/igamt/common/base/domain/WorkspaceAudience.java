package gov.nist.hit.hl7.igamt.common.base.domain;

public class WorkspaceAudience extends Audience {
    private String workspaceId;
    private String folderId;
    public WorkspaceAudience() {
        super(AudienceType.WORKSPACE);
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getFolderId() {
        return folderId;
    }

    public void setFolderId(String folderId) {
        this.folderId = folderId;
    }
}
