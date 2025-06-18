package gov.nist.hit.hl7.igamt.workspace.model;

import gov.nist.hit.hl7.igamt.workspace.domain.Folder;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;

import java.util.Set;

public class FolderInfo extends Folder {
    private String workspaceId;
    private WorkspacePermissionType permissionType;
    private Set<String> editors;

    public WorkspacePermissionType getPermissionType() {
        return permissionType;
    }

    public void setPermissionType(WorkspacePermissionType permissionType) {
        this.permissionType = permissionType;
    }

    public Set<String> getEditors() {
        return editors;
    }

    public void setEditors(Set<String> editors) {
        this.editors = editors;
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }
}
