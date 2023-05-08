package gov.nist.hit.hl7.igamt.workspace.domain;

import java.util.Map;

public class WorkspacePermissions {
    private boolean admin;
    private WorkspacePermissionType global;
    private Map<String, WorkspacePermissionType> byFolder;

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public WorkspacePermissionType getGlobal() {
        return global;
    }

    public void setGlobal(WorkspacePermissionType global) {
        this.global = global;
    }

    public Map<String, WorkspacePermissionType> getByFolder() {
        return byFolder;
    }

    public void setByFolder(Map<String, WorkspacePermissionType> byFolder) {
        this.byFolder = byFolder;
    }
}
