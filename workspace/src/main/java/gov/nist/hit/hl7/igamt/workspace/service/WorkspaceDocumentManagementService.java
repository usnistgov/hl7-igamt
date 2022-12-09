package gov.nist.hit.hl7.igamt.workspace.service;

import gov.nist.hit.hl7.igamt.common.base.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;

public interface WorkspaceDocumentManagementService {
    Workspace cloneIgAndMoveToWorkspaceLocation(String igId, String cloneName, String workspaceId, String folderId, String username) throws Exception;
    Workspace addDocumentToWorkspace(Ig document, String workspaceId, String folderId, String username) throws Exception;
    Ig createIgAndMoveToWorkspaceLocation(CreationWrapper wrapper, String username) throws Exception;
    Workspace removeDocumentFromWorkspace(String igId, String workspaceId, String folderId, String username) throws Exception;
}
