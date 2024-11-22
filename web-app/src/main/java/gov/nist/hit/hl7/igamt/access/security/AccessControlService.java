package gov.nist.hit.hl7.igamt.access.security;

import gov.nist.hit.hl7.igamt.access.common.ResourceAccessInfoFetcher;
import gov.nist.hit.hl7.igamt.access.model.*;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.service.impl.UserResourcePermissionService;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspacePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.HashSet;

@Service
public class AccessControlService implements UserResourcePermissionService {

    @Autowired
    private WorkspacePermissionService workspacePermissionService;
    @Autowired
    private ResourceAccessInfoFetcher resourceAccessInfoFetcher;


    public AccessPermission getDocumentAccessPermission(Type type, String id, AccessToken token) throws ResourceNotFoundException {
        return this.checkDocumentAccessPermission(resourceAccessInfoFetcher.getDocument(type, id), token);
    }

    public AccessPermission getResourceAccessPermission(Type type, String id, AccessToken token) throws ResourceNotFoundException {
        return this.checkResourceAccessPermission(type, id,  token);
    }

    public AccessPermission getWorkspaceAccessPermission(Type type, String id, AccessToken token) throws ResourceNotFoundException {
        return this.checkDocumentAccessPermission(resourceAccessInfoFetcher.getDocument(type, id), token);
    }

    public AccessPermission getCodeSetAccessPermission(String id, AccessToken token) throws ResourceNotFoundException {
        return this.checkCodeSetAccessPermission(resourceAccessInfoFetcher.getCodeSetAccessInfo(id), token);
    }

    public boolean checkWorkspaceAccessPermission(String id, AccessToken token, Action requested) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        return this.evaluateAccessLevel(this.checkWorkspaceAccessPermission(workspace, token), requested);
    }

    public boolean checkWorkspaceFolderAccessPermission(String id, String folderId, AccessToken token, Action requested) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        return this.evaluateAccessLevel(this.checkWorkspaceFolderAccessPermission(workspace, folderId, token), requested);
    }

    public boolean isWorkspaceAdmin(String id, AccessToken token) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        return this.workspacePermissionService.isAdmin(workspace, token.getUsername());
    }

    public boolean isWorkspaceOwner(String id, AccessToken token) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        return this.workspacePermissionService.isOwner(workspace, token.getUsername());
    }


    public boolean checkResourceAccessPermission(Type type, String id, AccessToken user, Action requested) throws ResourceNotFoundException {
        return this.evaluateAccessLevel(this.checkResourceAccessPermission(
                type,
                id,
                user
        ), requested);
    }

    public boolean evaluateAccessLevel(AccessPermission permission, Action requested) {
        return permission.actionIsAllowed(requested);
    }

    public AccessPermission checkResourceAccessPermission(Type type, String id, AccessToken user) throws ResourceNotFoundException {
        if(resourceAccessInfoFetcher.isDocument(type)) {
            return this.checkDocumentAccessPermission(resourceAccessInfoFetcher.getDocument(type, id), user);
        } else {
            switch(type) {
                case CODESET:
                    return this.checkCodeSetAccessPermission(resourceAccessInfoFetcher.getCodeSetAccessInfo(id), user);
                case CODESETVERSION:
                    return this.checkCodeSetAccessPermission(resourceAccessInfoFetcher.getCodeSetAccessInfoByCodeSetVersionId(id), user);
                default:
                    return this.checkResourceAccessPermission(resourceAccessInfoFetcher.getResourceInfo(type, id), user);
            }
        }
    }

    public AccessPermission checkDocumentAccessPermission(DocumentAccessInfo document, AccessToken token) {
        AccessPermission.AccessPermissionHolder accessPermissionHolder = new AccessPermission.AccessPermissionHolder();
        boolean statusIsArchived = (document.getStatus() != null && document.getStatus().equals(Status.ARCHIVED));
        boolean scopeIsArchived = (document.getDomainInfo() != null && document.getDomainInfo().getScope() != null && document.getDomainInfo().getScope().equals(Scope.ARCHIVED));

        // If document is archived
        if(statusIsArchived || scopeIsArchived) {
            // Grant No access
            accessPermissionHolder.denyAll();
        } else {
            if(document.getAudience() != null) {
                // A public document can be "READ" but never written to
                if(document.getAudience() instanceof PublicAudience) {
                    // Grant READ access
                    accessPermissionHolder.allowAction(Action.READ);
                } else {
                    AccessPermission audienceAccessPermission = this.checkAudience(document.getAudience(), token);
                    accessPermissionHolder.allow(audienceAccessPermission);
                }
            } else {
                // If document is published (but doesn't have an Audience set)
                if(document.getStatus() != null && document.getStatus().equals(Status.PUBLISHED)) {
                    // Grant READ access
                    accessPermissionHolder.allowAction(Action.READ);
                }
            }
            if(isAdmin(token)) {
                // Admin can READ all documents
                accessPermissionHolder.allowAction(Action.READ);
            }
        }
        return accessPermissionHolder.getPermission();
    }

    public AccessPermission checkCodeSetAccessPermission(CodeSetAccessInfo codeSetAccessInfo, AccessToken token) {
        AccessPermission.AccessPermissionHolder accessPermissionHolder = new AccessPermission.AccessPermissionHolder();
        // Owner of a code set has all permissions on the code set regardless of the Audience
        if(codeSetAccessInfo.getUsername().equals(token.getUsername())) {
            accessPermissionHolder.allowActions(Action.READ, Action.WRITE);
        } else {
            if(codeSetAccessInfo.getAudience() instanceof PublicAudience) {
                // Grant READ access
                accessPermissionHolder.allowAction(Action.READ);
                // All Admins can write to published code sets
                if(isAdmin(token)) {
                    accessPermissionHolder.allowAction(Action.WRITE);
                }
            } else {
                AccessPermission audienceAccessPermission = this.checkAudience(codeSetAccessInfo.getAudience(), token);
                accessPermissionHolder.allow(audienceAccessPermission);
            }
        }
        // Committed Code Set Version cannot be WRITTEN to
        if(codeSetAccessInfo.isCodeSetVersion() && codeSetAccessInfo.isCommitted()) {
            accessPermissionHolder.denyAction(Action.WRITE);
        }
        return accessPermissionHolder.getPermission();
    }

    public AccessPermission checkResourceAccessPermission(ResourceInfo resourceInfo, AccessToken token) throws ResourceNotFoundException {
        // If the resource is an HL7 resource, can READ only
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
            // Grant READ access
            return AccessPermission.withActions(Action.READ);
        }

        // If the resource is archived
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.ARCHIVED)) {
            // Grant NO access
            return AccessPermission.withNoAction();
        }

        // If the resource is a user custom element
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.USERCUSTOM)) {
            boolean userIsOwner = resourceInfo.getUsername() != null && resourceInfo.getUsername().equals(token.getUsername());
            boolean userIsParticipant = resourceInfo.getParticipants() != null && resourceInfo.getParticipants().contains(token.getUsername());
            // If user is the owner
            if(userIsOwner || userIsParticipant) {
                // If it's published
                if(resourceInfo.getStatus() != null && resourceInfo.getStatus().equals(Status.PUBLISHED)) {
                    // Grant READ access
                    return AccessPermission.withActions(Action.READ, Action.UNLOCK);
                } else {
                    // Grant ALL access
                    return AccessPermission.withActions(Action.READ, Action.WRITE, Action.UNLOCK);
                }
            } else {
                return AccessPermission.withNoAction();
            }
        }

        // If document Info is not available
        if(resourceInfo.getDocumentInfo() == null) {
            // Grant NO access
            return AccessPermission.withNoAction();
        }

        return this.checkDocumentAccessPermission(
                resourceAccessInfoFetcher.getDocumentAccessInfo(resourceInfo.getDocumentInfo()),
                token
        );
    }

    public AccessPermission checkWorkspaceAccessPermission(Workspace workspace, AccessToken token) {
        if(this.workspacePermissionService.hasAccessTo(workspace, token.getUsername())) {
            if(this.workspacePermissionService.isAdmin(workspace, token.getUsername())) {
                return AccessPermission.withActions(Action.READ, Action.WRITE);
            } else {
                return AccessPermission.withActions(Action.READ, Action.READ);
            }
        } else {
            if(isAdmin(token)) {
                return AccessPermission.withActions(Action.READ);
            } else {
                return AccessPermission.withNoAction();
            }
        }
    }

    public AccessPermission checkWorkspaceFolderAccessPermission(Workspace workspace, String folderId, AccessToken token) {
        WorkspacePermissionType workspacePermissionType = this.workspacePermissionService.getWorkspacePermissionTypeByFolder(workspace, token.getUsername(), folderId);
        if(workspacePermissionType != null) {
            switch (workspacePermissionType) {
                case EDIT:
                    return AccessPermission.all();
                case VIEW:
                    return AccessPermission.withActions(Action.READ);
            }
        }
        return AccessPermission.withNoAction();
    }

    private AccessPermission checkAudience(Audience audience, AccessToken token) {
        switch (audience.getType()) {
            case PUBLIC:
                return this.checkPublicAudience((PublicAudience) audience, token);
            case PRIVATE:
                return this.checkPrivateAudience((PrivateAudience) audience, token);
            case WORKSPACE:
                return this.checkWorkspaceAudience((WorkspaceAudience) audience, token);
        }
        return null;
    }

    private AccessPermission checkPrivateAudience(PrivateAudience audience, AccessToken token) {
        // If user is editor
        if(token.getUsername().equals(audience.getEditor())) {
            // Grant all access
            return AccessPermission.all();
        }

        // If user is viewer
        if(audience.getViewers().contains(token.getUsername())) {
            // Grant user access
            return AccessPermission.withActions(Action.READ);
        }

        if(isAdmin(token)) {
            return AccessPermission.withActions(Action.READ);
        }

        return AccessPermission.withNoAction();
    }

    private AccessPermission checkPublicAudience(PublicAudience audience, AccessToken token) {
        return AccessPermission.withActions(Action.READ);
    }

    public AccessPermission checkWorkspaceAudience(WorkspaceAudience audience, AccessToken token) {
        WorkspacePermissionType permissionType = this.workspacePermissionService.getWorkspacePermissionTypeByFolder(audience.getWorkspaceId(), token.getUsername(), audience.getFolderId());
        if (permissionType != null) {
            switch (permissionType) {
                case EDIT:
                    return AccessPermission.all();
                case VIEW:
                    return AccessPermission.withActions(Action.READ);
            }
        }
        if(isAdmin(token)) {
            return AccessPermission.withActions(Action.READ);
        }
        return AccessPermission.withNoAction();
    }

    public boolean checkExportConfigurationAccessPermission(String exportConfigurationId, AccessToken token, Action level) throws ResourceNotFoundException {
        ExportConfigurationInfo exportConfigurationInfo = resourceAccessInfoFetcher.getExportConfigurationInfo(exportConfigurationId);

        if(exportConfigurationInfo.getUsername() != null && !exportConfigurationInfo.getUsername().isEmpty()) {
            // If user is owner
            if(exportConfigurationInfo.getUsername().equals(token.getUsername())) {
                // Grant ALL access
                return true;
            }
        } else {
            // If configuration is original
            if(exportConfigurationInfo.isOriginal()) {
                // Grant READ access
                return level.equals(Action.READ);
            }
        }

        return false;
    }

    public boolean isPublisher(AccessToken token) {
        return this.isAdmin(token);
    }

    public boolean isAdmin(AccessToken token) {
        return token.getAuthorities() != null && token.getAuthorities().stream().anyMatch((a) -> a.getAuthority().equals("ADMIN"));
    }

    public AccessToken asAccessToken(UsernamePasswordAuthenticationToken authenticationToken) {
        return new AccessToken(authenticationToken.getName(), new HashSet<>(authenticationToken.getAuthorities()));
    }

    @Override
    public boolean hasPermission(Type type, String id, Action level) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        AccessToken currentUser = new AccessToken(usernamePasswordAuthenticationToken.getName(), new HashSet<>(usernamePasswordAuthenticationToken.getAuthorities()));
        try {
            return this.checkResourceAccessPermission(type, id, currentUser, level);
        } catch(Exception e) {
            return false;
        }
    }
}