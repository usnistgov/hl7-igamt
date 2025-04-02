package gov.nist.hit.hl7.igamt.common.base.domain;

public class WorkspaceAudience extends Audience {
    private String workspaceId;
    private String folderId;
    public WorkspaceAudience() {
        super(AudienceType.WORKSPACE);
    }

    public WorkspaceAudience(String workspaceId, String folderId) {
        super(AudienceType.WORKSPACE);
        this.workspaceId = workspaceId;
        this.folderId = folderId;
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
