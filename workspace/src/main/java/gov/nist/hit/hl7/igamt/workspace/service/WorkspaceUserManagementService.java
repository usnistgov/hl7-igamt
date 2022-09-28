package gov.nist.hit.hl7.igamt.workspace.service;

import gov.nist.hit.hl7.auth.util.requests.FindUserResponse;
import gov.nist.hit.hl7.igamt.auth.exception.AuthenticationException;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissions;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceUser;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface WorkspaceUserManagementService {
    FindUserResponse getUserByUsernameOrEmail(String value, boolean email, HttpServletRequest request) throws AuthenticationException;
    WorkspaceUser invite(String workspaceId, String performedBy, String invitee, WorkspacePermissions permissions) throws Exception;
    WorkspaceUser acceptInvitation(String invitationId, String username) throws Exception;
    WorkspaceUser declineInvitation(String invitationId, String username) throws Exception;
    Workspace removeUser(Workspace workspace, String performedBy, String username) throws Exception;
    Workspace changeUserPermissions(Workspace workspace, String performedBy, String username, WorkspacePermissions permissions) throws Exception;
    boolean userHasPendingInvitation(Workspace workspace, String username);
    List<Workspace> getUserInvitations(String username);
}
