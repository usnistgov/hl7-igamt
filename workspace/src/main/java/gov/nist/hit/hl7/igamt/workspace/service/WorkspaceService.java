package gov.nist.hit.hl7.igamt.workspace.service;

import java.util.List;
import java.util.Map;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.model.*;
import gov.nist.hit.hl7.igamt.workspace.exception.CreateRequestException;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;

public interface WorkspaceService {

	// Getters
	Workspace findById(String id) throws WorkspaceNotFound;
	List<Workspace> findAll();
	List<Workspace> findByMember(String username);
	WorkspaceInfo getWorkspaceInfo(String id, String username) throws WorkspaceNotFound, WorkspaceForbidden;
	WorkspaceInfo getWorkspaceInfo(Workspace workspace, String username) throws WorkspaceNotFound, WorkspaceForbidden;

	List<WorkspaceListItem> convertToDisplayList(List<Workspace> workspaces, boolean invitation);

	FolderContent getFolderContent(String workspaceId, String folderId, String username) throws Exception;
	Map<String, Map<String, WorkspacePermissionType>> getUserWorkspacesPermissions(String username);

	// Actions
	Workspace createWorkspace(WorkspaceCreateRequest createInfo, String username) throws CreateRequestException;
	Workspace createFolder(String workspaceId, AddFolderRequest addFolderRequest, String username) throws Exception;
	Workspace deleteFolder(String workspaceId, String folderId, String username) throws Exception;

	// Save
	Workspace saveHomeContent(String workspaceId, HomeContentWrapper home, String username) throws Exception;
	Workspace saveMetadata(String workspaceId, WorkspaceMetadataWrapper workspaceMetadataWrapper, String username) throws Exception;
	Workspace save(Workspace workspace) throws ForbiddenOperationException;
	Workspace updateFolder(String workspaceId, String folderId, AddFolderRequest addFolderRequest, String username) throws Exception;
	void delete(Workspace workspace, String performedBy) throws WorkspaceForbidden;
}
