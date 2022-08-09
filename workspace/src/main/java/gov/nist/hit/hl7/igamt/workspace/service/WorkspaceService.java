package gov.nist.hit.hl7.igamt.workspace.service;

import java.util.List;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.workspace.domain.UserAccessInfo;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceAccessType;
import gov.nist.hit.hl7.igamt.workspace.model.*;
import gov.nist.hit.hl7.igamt.workspace.exception.CreateRequestException;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;

public interface WorkspaceService {

	Workspace findById(String id);
	Workspace create(WorkspaceCreateRequest createInfo, String userId) throws CreateRequestException;
	Workspace createFolder(String workspaceId, AddFolderRequest addFolderRequest, String username) throws Exception;
	Workspace updateFolder(String workspaceId, String folderId, AddFolderRequest addFolderRequest, String username) throws Exception;
	Workspace saveHomeContent(String workspaceId, HomeContentWrapper home, String username) throws Exception;
	Workspace saveMetadata(String workspaceId, WorkspaceMetadataWrapper workspaceMetadataWrapper, String username) throws Exception;

	Workspace save(Workspace workspace) throws ForbiddenOperationException;
	List<Workspace> findAll();
	void delete(Workspace workspace) throws ForbiddenOperationException;

	List<Workspace> findByMember(String username);
	List<Workspace> findByMemberPending(String username);
	List<Workspace> findByAccessType(WorkspaceAccessType public1);
	List<Workspace> findByAccessTypeAndUsername(WorkspaceAccessType private1, String username);
	List<Workspace> findShared(String username);
	List<Workspace> findByAll();

	WorkspaceInfo getWorkspaceInfo(String id, String username) throws WorkspaceNotFound, WorkspaceForbidden;

	WorkspaceInfo getWorkspaceInfo(Workspace workspace, String username) throws WorkspaceNotFound, WorkspaceForbidden;

	UserAccessInfo getUserAccessInfo(String id);


	List<WorkspaceListItem> convertToDisplayList(List<Workspace> workspaces);

	FolderContent getFolderContent(String workspaceId, String folderId, String username) throws Exception;
	
}
