package gov.nist.hit.hl7.igamt.workspace.service.impl;

import gov.nist.hit.hl7.auth.util.requests.FindUserRequest;
import gov.nist.hit.hl7.auth.util.requests.FindUserResponse;
import gov.nist.hit.hl7.igamt.auth.exception.AuthenticationException;
import gov.nist.hit.hl7.igamt.auth.service.AuthenticationService;
import gov.nist.hit.hl7.igamt.workspace.domain.*;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import gov.nist.hit.hl7.igamt.workspace.repository.WorkspaceRepo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspacePermissionService;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceUserManagementService;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

@Service
public class WorkspaceUserManagementServiceImpl implements WorkspaceUserManagementService {

    @Autowired
    AuthenticationService authService;
    @Autowired
    WorkspacePermissionService permissionService;
    @Autowired
    WorkspaceRepo workspaceRepo;
    @Autowired
    WorkspaceVerificationService workspaceVerificationService;
    @Autowired
    WorkspaceService workspaceService;
    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public FindUserResponse getUserByUsernameOrEmail(String value, boolean email, HttpServletRequest request) throws AuthenticationException {
        FindUserRequest findUserRequest = new FindUserRequest();
        findUserRequest.setEmail(email);
        findUserRequest.setValue(value);
        return authService.findUser(request, findUserRequest);
    }

    @Override
    public WorkspaceUser invite(String workspaceId, String performedBy, String invitee, WorkspacePermissions permissions) throws Exception {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));

        if(this.permissionService.isAdmin(workspace, performedBy)) {
            this.workspaceVerificationService.checkPermissions(permissions);
            boolean userExistsInWorkspace = this.permissionService.hasAccessTo(workspace, invitee);
            boolean hasPendingInvitation = this.userHasPendingInvitation(workspace, invitee);
            if(userExistsInWorkspace || hasPendingInvitation) {
                throw new Exception("Already member of the workspace or has a pending invitation");
            } else {
                WorkspaceUser found = workspace.getUserAccessInfo().getUsers().stream().filter(u -> u.getUsername().equals(invitee)).findFirst().orElse(null);
                if(found != null) {
                    found.setUsername(invitee);
                    found.setInvitedBy(performedBy);
                    found.setPermissions(permissions);
                    found.setAdded(new Date());
                    found.setStatus(InvitationStatus.PENDING);
                    this.workspaceRepo.save(workspace);
                    return found;
                } else {
                    WorkspaceUser pendingUser = new WorkspaceUser();
                    pendingUser.setUsername(invitee);
                    pendingUser.setInvitedBy(performedBy);
                    pendingUser.setPermissions(permissions);
                    pendingUser.setAdded(new Date());
                    pendingUser.setStatus(InvitationStatus.PENDING);
                    workspace.getUserAccessInfo().getUsers().add(pendingUser);
                    this.workspaceRepo.save(workspace);
                    return pendingUser;
                }
            }
        } else {
            throw new WorkspaceForbidden();
        }
    }

    @Override
    public WorkspaceUser acceptInvitation(String workspaceId, String username) throws Exception {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));

        if(this.userHasPendingInvitation(workspace, username) && !this.permissionService.hasAccessTo(workspace, username)) {
            WorkspaceUser invitee = workspace.getUserAccessInfo().getUsers().stream().filter(u -> u.getUsername().equals(username)).findFirst().orElse(null);
            invitee.setStatus(InvitationStatus.ACCEPTED);
            invitee.setJoined(new Date());
            this.workspaceRepo.save(workspace);
            return invitee;
        } else {
            throw new Exception("Invitation not found");
        }
    }

    @Override
    public WorkspaceUser declineInvitation(String workspaceId, String username) throws Exception {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));

        if(this.userHasPendingInvitation(workspace, username) && !this.permissionService.hasAccessTo(workspace, username)) {
            WorkspaceUser invitee = workspace.getUserAccessInfo().getUsers().stream().filter(u -> u.getUsername().equals(username)).findFirst().orElse(null);
            invitee.setStatus(InvitationStatus.DECLINED);
            invitee.setJoined(new Date());
            this.workspaceRepo.save(workspace);
            return invitee;
        } else {
            throw new Exception("Invitation not found");
        }
    }

    @Override
    public Workspace removeUser(Workspace workspace, String performedBy, String username) throws Exception {
        if(this.permissionService.isAdmin(workspace, performedBy)) {
            WorkspaceUser user = this.getUserFromWorkspace(workspace, username);
            if(user != null) {
                workspace.getUserAccessInfo().getUsers().remove(user);
                return this.workspaceRepo.save(workspace);
            } else {
                throw new Exception("User is not part of the workspace");
            }
        } else {
            throw new WorkspaceForbidden();
        }
    }

    @Override
    public Workspace changeUserPermissions(Workspace workspace, String performedBy, String username, WorkspacePermissions permissions) throws Exception {
        if(this.permissionService.isAdmin(workspace, performedBy)) {
            WorkspaceUser user = this.getUserFromWorkspace(workspace, username);
            if(user != null) {
                this.workspaceVerificationService.checkPermissions(permissions);
                user.setPermissions(permissions);
                return this.workspaceRepo.save(workspace);
            } else {
                throw new Exception("User is not part of the workspace");
            }
        } else {
            throw new WorkspaceForbidden();
        }
    }

    @Override
    public Workspace changeOwner(Workspace workspace, String performedBy, String username) throws Exception {
        if(this.permissionService.isOwner(workspace, performedBy)) {
            if(this.permissionService.hasAccessTo(workspace, username)) {
                workspace.setUsername(username);
                WorkspaceUser user = this.getUserFromWorkspace(workspace, username);
                workspace.getUserAccessInfo().getUsers().remove(user);

                WorkspacePermissions permissions = new WorkspacePermissions();
                WorkspaceUser admin = new WorkspaceUser();
                admin.setUsername(performedBy);
                permissions.setAdmin(true);
                admin.setPermissions(permissions);
                admin.setStatus(InvitationStatus.ACCEPTED);

                workspace.getUserAccessInfo().getUsers().add(admin);
                return this.workspaceRepo.save(workspace);
            } else {
                throw new Exception("User does not have access to the workspace");
            }
        } else {
            throw new WorkspaceForbidden();
        }
    }

    @Override
    public boolean userHasPendingInvitation(Workspace workspace, String username) {
        if(workspace.getUsername().equals(username)) return false;
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream()
                    .anyMatch((user) -> user.getUsername().equals(username) && user.getStatus().equals(InvitationStatus.PENDING));
        }
        return false;
    }

    @Override
    public List<Workspace> getUserInvitations(String username) {
        Criteria criteria = new Criteria();
        Query query = new Query(Criteria.where("userAccessInfo.users").elemMatch(
                criteria.andOperator(
                        Criteria.where("username").is(username),
                        Criteria.where("status").is(InvitationStatus.PENDING)
                )
        ));
        return this.mongoTemplate.find(query, Workspace.class);
    }

    public WorkspaceUser getUserFromWorkspace(Workspace workspace, String username) {
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream()
                    .filter((user) -> user.getUsername().equals(username))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

}
