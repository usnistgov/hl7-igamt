package gov.nist.hit.hl7.igamt.workspace.model;

import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissions;

public class UserUpdateRequest {
    private String username;
    private WorkspacePermissions permissions;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public WorkspacePermissions getPermissions() {
        return permissions;
    }

    public void setPermissions(WorkspacePermissions permissions) {
        this.permissions = permissions;
    }
}
