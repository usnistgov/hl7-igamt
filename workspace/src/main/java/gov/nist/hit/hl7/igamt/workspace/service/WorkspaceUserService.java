package gov.nist.hit.hl7.igamt.workspace.service;

import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissions;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceUser;
import gov.nist.hit.hl7.igamt.workspace.exception.UsernameNotFound;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceAccessInfo;

import java.util.Set;

public interface WorkspaceUserService {
    WorkspacePermissionType getWorkspacePermissionTypeByFolder(Workspace workspace, String username, String folderId);
    Set<String> getFolderEditors(Workspace workspace, String folderId);
    boolean isAdmin(Workspace workspace, String username);
    WorkspaceUser invite(String performedBy, String invitee, WorkspacePermissions permissions, String workspaceId) throws Exception;
    WorkspaceUser acceptInvite(String performedBy, String workspaceId) throws Exception;
    WorkspaceUser changePermissions(String performedBy, String user, WorkspacePermissions permissions, String workspaceId) throws WorkspaceNotFound, WorkspaceForbidden, UsernameNotFound;
    void removeUser(String performedBy, String username, String workspaceId) throws WorkspaceNotFound, WorkspaceForbidden, UsernameNotFound;
    boolean hasAccessTo(String username, Workspace workspace) throws WorkspaceNotFound;
    WorkspaceAccessInfo getUserAccessInfo(String workspaceId) throws ResourceNotFoundException;
    WorkspacePermissionType getUserPermissionByFolder(String workspaceId, String folderId, String username) throws ResourceNotFoundException;
}
