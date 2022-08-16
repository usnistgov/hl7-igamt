package gov.nist.hit.hl7.igamt.workspace.service.impl;

import gov.nist.hit.hl7.igamt.auth.service.AuthenticationService;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.workspace.domain.*;
import gov.nist.hit.hl7.igamt.workspace.exception.UsernameNotFound;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceAccessInfo;
import gov.nist.hit.hl7.igamt.workspace.repository.WorkspaceRepo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkspaceUserServiceImpl implements WorkspaceUserService {
    @Autowired
    WorkspaceRepo workspaceRepo;
    @Autowired
    AuthenticationService authService;
    @Autowired
    MongoTemplate mongoTemplate;
    private final Set<String> workspaceAccessInfoFields  = Arrays.stream(WorkspaceAccessInfo.class.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());

    void checkUsernameExists(String username) throws UsernameNotFound {
        // TODO
    }

    boolean userExists(Workspace workspace, String username) {
        if(workspace.getUsername().equals(username)) return true;
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream()
                    .anyMatch((user) -> user.getUsername().equals(username));
        }
        return false;
    }

    WorkspaceUser findUser(Workspace workspace, String username) {
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream()
                    .filter((user) -> user.getUsername().equals(username))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    WorkspaceUser findUser(WorkspaceAccessInfo workspace, String username) {
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream()
                    .filter((user) -> user.getUsername().equals(username))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    @Override
    public WorkspacePermissionType getWorkspacePermissionTypeByFolder(Workspace workspace, String username, String folderId) {
        if(workspace.getUsername().equals(username)) return WorkspacePermissionType.EDIT;
        WorkspaceUser user = findUser(workspace, username);
        if (user != null) {
            if (user.getPermissions().isAdmin()) {
                return WorkspacePermissionType.EDIT;
            }
            if (user.getPermissions().getGlobal() != null) {
                return user.getPermissions().getGlobal();
            }
            if (user.getPermissions().getByFolder() != null) {
                return user.getPermissions().getByFolder().get(folderId);
            }
        }
        return null;
    }

    @Override
    public Set<String> getFolderEditors(Workspace workspace, String folderId) {
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream().filter((user) ->
                !user.isPending() && WorkspacePermissionType.EDIT.equals(getWorkspacePermissionTypeByFolder(workspace, user.getUsername(), folderId))
            ).map(WorkspaceUser::getUsername).collect(Collectors.toSet());
        } else {
            return Collections.singleton(workspace.getUsername());
        }
    }

    @Override
    public boolean isAdmin(Workspace workspace, String username) {
        if(workspace.getUsername().equals(username)) return true;
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream()
                    .anyMatch((user) -> user.getUsername().equals(username) && !user.isPending() && user.getPermissions().isAdmin());
        }
        return false;
    }


    void checkUserHasAdminPrivilege(Workspace workspace, String username) throws WorkspaceForbidden {
        if(workspace.getUsername().equals(username)) return;
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            if(workspace.getUserAccessInfo().getUsers().stream().anyMatch((user) ->
                    !user.isPending() &&
                    user.getPermissions() != null &&
                    user.getPermissions().isAdmin() &&
                    user.getUsername().equals(username))) {
                return;
            }
        }
        throw new WorkspaceForbidden();
    }

    @Override
    public WorkspaceUser invite(String performedBy, String invitee, WorkspacePermissions permissions, String workspaceId) throws Exception {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));
        checkUserHasAdminPrivilege(workspace, performedBy);
        checkUsernameExists(invitee);
        if(userExists(workspace, invitee)) {
            throw new Exception("User "+ invitee+" already exists in workspace");
        }

        WorkspaceUser workspaceUser = new WorkspaceUser();
        workspaceUser.setAdded(new Date());
        workspaceUser.setPending(true);
        workspaceUser.setPermissions(permissions);
        workspaceUser.setUsername(invitee);
        workspaceUser.setInvitedBy(performedBy);
        if(workspace.getUserAccessInfo() == null) {
            workspace.setUserAccessInfo(new UserAccessInfo());
        }
        if(workspace.getUserAccessInfo().getUsers() == null) {
            workspace.getUserAccessInfo().setUsers(new HashSet<>());
        }
        workspace.getUserAccessInfo().getUsers().add(workspaceUser);
        this.workspaceRepo.save(workspace);
        return workspaceUser;
    }

    @Override
    public WorkspaceUser acceptInvite(String performedBy, String workspaceId) throws Exception {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));
        WorkspaceUser user = findUser(workspace, performedBy);
        if(user == null) {
            throw new UsernameNotFound(performedBy);
        }
        if(!user.isPending()) {
            throw new Exception("User is already a member");
        }
        user.setPending(false);
        this.workspaceRepo.save(workspace);
        return user;
    }

    @Override
    public WorkspaceUser changePermissions(String performedBy, String username, WorkspacePermissions permissions, String workspaceId) throws WorkspaceNotFound, WorkspaceForbidden, UsernameNotFound {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));
        checkUserHasAdminPrivilege(workspace, performedBy);

        WorkspaceUser user = findUser(workspace, username);
        if(user == null) {
            throw new UsernameNotFound(username);
        } else {
            user.setPermissions(permissions);
            this.workspaceRepo.save(workspace);
            return user;
        }
    }

    @Override
    public void removeUser(String performedBy, String username, String workspaceId) throws WorkspaceNotFound, WorkspaceForbidden, UsernameNotFound {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));
        checkUserHasAdminPrivilege(workspace, performedBy);

        WorkspaceUser user = findUser(workspace, username);
        if(user == null) {
            throw new UsernameNotFound(username);
        } else {
            workspace.getUserAccessInfo().getUsers().remove(user);
            this.workspaceRepo.save(workspace);
        }
    }

    @Override
    public boolean hasAccessTo(String username, Workspace workspace) {
        return this.userExists(workspace, username);
    }

    @Override
    public WorkspaceAccessInfo getUserAccessInfo(String workspaceId) throws ResourceNotFoundException {
        Query query = Query.query(Criteria.where("_id").is(workspaceId));
        this.workspaceAccessInfoFields.forEach((field) -> {
            query.fields().include(field);
        });
        WorkspaceAccessInfo resource = this.mongoTemplate.findOne(query, WorkspaceAccessInfo.class, "workspace");

        if(resource != null) {
            return resource;
        } else {
            throw new ResourceNotFoundException(workspaceId, Type.WORKSPACE);
        }
    }

    @Override
    public WorkspacePermissionType getUserPermissionByFolder(String workspaceId, String folderId, String username) throws ResourceNotFoundException {
        WorkspaceAccessInfo workspaceAccessInfo = this.getUserAccessInfo(workspaceId);
        if(workspaceAccessInfo.getUsername().equals(username)) return WorkspacePermissionType.EDIT;
        WorkspaceUser user = findUser(workspaceAccessInfo, username);
        if (user != null) {
            if (user.getPermissions().isAdmin()) {
                return WorkspacePermissionType.EDIT;
            }
            if (user.getPermissions().getGlobal() != null) {
                return user.getPermissions().getGlobal();
            }
            if (user.getPermissions().getByFolder() != null) {
                return user.getPermissions().getByFolder().get(folderId);
            }
        }
        return null;
    }

}
