package gov.nist.hit.hl7.igamt.workspace.model;

import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissions;

public class AddUserRequest {
    private boolean email;
    private String value;
    private WorkspacePermissions permissions;

    public boolean isEmail() {
        return email;
    }

    public void setEmail(boolean email) {
        this.email = email;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public WorkspacePermissions getPermissions() {
        return permissions;
    }

    public void setPermissions(WorkspacePermissions permissions) {
        this.permissions = permissions;
    }
}
