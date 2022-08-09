package gov.nist.hit.hl7.igamt.common.base.domain;

public class WorkspaceAudience extends Audience {
    private String workspaceId;
    public WorkspaceAudience() {
        super(AudienceType.WORKSPACE);
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }
}
