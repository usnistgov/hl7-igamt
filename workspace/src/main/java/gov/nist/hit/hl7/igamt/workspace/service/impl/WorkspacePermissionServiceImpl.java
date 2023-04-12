package gov.nist.hit.hl7.igamt.workspace.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceUser;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceAccessInfo;
import gov.nist.hit.hl7.igamt.workspace.repository.WorkspaceRepo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspacePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class WorkspacePermissionServiceImpl implements WorkspacePermissionService {

    @Autowired
    WorkspaceRepo workspaceRepo;
    @Autowired
    MongoTemplate mongoTemplate;
    private final Set<String> workspaceAccessInfoFields  = Arrays.stream(WorkspaceAccessInfo.class.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());

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
    public WorkspacePermissionType getWorkspacePermissionTypeByFolder(String workspaceId, String username, String folderId) {
        return this.workspaceRepo.findById(workspaceId)
                .map((ws) -> getWorkspacePermissionTypeByFolder(ws, username, folderId))
                .orElse(null);
    }

    @Override
    public boolean isAdmin(Workspace workspace, String username) {
        if(workspace.getUsername().equals(username)) return true;
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream()
                    .anyMatch((user) -> user.getUsername().equals(username) && user.hasAccess() && user.getPermissions().isAdmin());
        }
        return false;
    }

    @Override
    public boolean isOwner(Workspace workspace, String username) {
        return workspace.getUsername().equals(username);
    }

    @Override
    public boolean hasAccessTo(Workspace workspace, String username) {
        if(workspace.getUsername().equals(username)) return true;
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            return workspace.getUserAccessInfo().getUsers().stream()
                    .anyMatch((user) -> user.getUsername().equals(username) && user.hasAccess());
        }
        return false;
    }

    @Override
    public WorkspaceAccessInfo getWorkspaceAccessInfo(String workspaceId) throws ResourceNotFoundException {
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
    public Set<String> getFolderEditors(Workspace workspace, String folderId) {
        if(workspace.getUserAccessInfo() != null && workspace.getUserAccessInfo().getUsers() != null) {
            Set<String> users = workspace.getUserAccessInfo().getUsers().stream().filter((user) ->
                    user.hasAccess() && WorkspacePermissionType.EDIT.equals(getWorkspacePermissionTypeByFolder(workspace, user.getUsername(), folderId))
            ).map(WorkspaceUser::getUsername).collect(Collectors.toSet());
            users.add(workspace.getUsername());
            return users;
        } else {
            return Collections.singleton(workspace.getUsername());
        }
    }
}
