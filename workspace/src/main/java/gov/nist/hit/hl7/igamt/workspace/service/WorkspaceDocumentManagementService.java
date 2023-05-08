package gov.nist.hit.hl7.igamt.workspace.service;

import gov.nist.hit.hl7.igamt.common.base.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.display.model.PublishingInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import org.springframework.transaction.annotation.Transactional;

public interface WorkspaceDocumentManagementService {
    Workspace moveIg(String igId, String title, String workspaceId, String sourceFolderId, String targetFolder, boolean clone, String username) throws Exception;
    Workspace publishIg(String igId, String workspaceId, String folderId, PublishingInfo info, String username) throws Exception;
    Workspace cloneIgAndMoveToWorkspaceLocation(String igId, String cloneName, String workspaceId, String folderId, CopyInfo copyInfo, String username) throws Exception;
    Workspace addDocumentToWorkspace(Ig document, String workspaceId, String folderId, String username) throws Exception;
    Ig createIgAndMoveToWorkspaceLocation(CreationWrapper wrapper, String username) throws Exception;
    Workspace removeDocumentFromWorkspace(Ig document, String workspaceId, String folderId, boolean delete, String username) throws Exception;
    Workspace deleteDocumentFromWorkspace(String igId, String workspaceId, String folderId, String username) throws Exception;
}
