package gov.nist.hit.hl7.igamt.workspace.service;

import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceAccessInfo;

import java.util.Set;

public interface WorkspacePermissionService {
    WorkspacePermissionType getWorkspacePermissionTypeByFolder(Workspace workspace, String username, String folderId);
    WorkspacePermissionType getWorkspacePermissionTypeByFolder(String workspaceId, String username, String folderId);
    boolean isAdmin(Workspace workspace, String username);
    boolean isOwner(Workspace workspace, String username);
    boolean hasAccessTo(Workspace workspace, String username);
    WorkspaceAccessInfo getWorkspaceAccessInfo(String workspaceId) throws ResourceNotFoundException;
    Set<String> getFolderEditors(Workspace workspace, String folderId);
}
