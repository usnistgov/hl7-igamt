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
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class AccessControlService implements UserResourcePermissionService {

    @Autowired
    private WorkspacePermissionService workspacePermissionService;
    @Autowired
    private ResourceAccessInfoFetcher resourceAccessInfoFetcher;


    public boolean evaluateAccessLevel(Set<AccessLevel> granted, AccessLevel requested) {
        if(granted == null)
            return false;
        if(granted.contains(requested) || granted.contains(AccessLevel.ALL)) {
            return true;
        }
        return requested.equals(AccessLevel.READ) && granted.contains(AccessLevel.WRITE);
    }

    public Set<AccessLevel> getDocumentAccessPermission(Type type, String id, AccessToken token) throws ResourceNotFoundException {
        return this.checkDocumentAccessPermission(resourceAccessInfoFetcher.getDocument(type, id), token);
    }

    public boolean checkWorkspaceAccessPermission(String id, AccessToken token, AccessLevel requested) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        if(this.workspacePermissionService.hasAccessTo(workspace, token.getUsername())) {
            if(this.workspacePermissionService.isAdmin(workspace, token.getUsername())) {
                return this.evaluateAccessLevel(L(AccessLevel.ALL), requested);
            } else {
                return this.evaluateAccessLevel(L(AccessLevel.READ), requested);
            }
        } else {
            if(isAdmin(token)) {
                return this.evaluateAccessLevel(L(AccessLevel.READ), requested);
            } else {
                return false;
            }
        }
    }

    public boolean checkWorkspaceFolderAccessPermission(String id, String folderId, AccessToken token, AccessLevel requested) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        WorkspacePermissionType workspacePermissionType = this.workspacePermissionService.getWorkspacePermissionTypeByFolder(workspace, token.getUsername(), folderId);
        if(workspacePermissionType != null) {
            switch (workspacePermissionType) {
                case EDIT:
                    return this.evaluateAccessLevel(L(AccessLevel.WRITE), requested);
                case VIEW:
                    return this.evaluateAccessLevel(L(AccessLevel.READ), requested);
            }
        }
        return false;
    }

    public boolean isWorkspaceAdmin(String id, AccessToken token) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        return this.workspacePermissionService.isAdmin(workspace, token.getUsername());
    }

    public boolean isWorkspaceOwner(String id, AccessToken token) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        return this.workspacePermissionService.isOwner(workspace, token.getUsername());
    }


    public boolean checkResourceAccessPermission(Type type, String id, AccessToken user, AccessLevel requested) throws ResourceNotFoundException {
        if(resourceAccessInfoFetcher.isDocument(type)) {
            return this.evaluateAccessLevel(this.checkDocumentAccessPermission(resourceAccessInfoFetcher.getDocument(type, id), user), requested);
        } else {
            switch(type) {
                case CODESET:
                    return this.evaluateAccessLevel(this.checkCodeSetAccessPermission(resourceAccessInfoFetcher.getCodeSetAccessInfo(id), user), requested);
                case CODESETVERSION:
                    return this.evaluateAccessLevel(this.checkCodeSetAccessPermission(resourceAccessInfoFetcher.getCodeSetAccessInfoByCodeSetVersionId(id), user), requested);
                default:
                    return this.evaluateAccessLevel(this.checkResourceAccessPermission(resourceAccessInfoFetcher.getResourceInfo(type, id), user), requested);
            }
        }
    }

    public Set<AccessLevel> checkDocumentAccessPermission(DocumentAccessInfo document, AccessToken token) {
        boolean statusIsArchived = (document.getStatus() != null && document.getStatus().equals(Status.ARCHIVED));
        boolean scopeIsArchived = (document.getDomainInfo() != null && document.getDomainInfo().getScope() != null && document.getDomainInfo().getScope().equals(Scope.ARCHIVED));

        // If document is archived
        if(statusIsArchived || scopeIsArchived) {
            // Grant No access
            return null;
        }

        if(document.getAudience() != null) {
            // A public document can be "READ" but never written to
            if(document.getAudience() instanceof PublicAudience) {
                // Grant READ access
                return L(AccessLevel.READ);
            }
            return this.checkAudience(document.getAudience(), token);
        }

        // If document is published (but doesn't have an Audience set)
        if(document.getStatus() != null && document.getStatus().equals(Status.PUBLISHED)) {
            // Grant READ access
            return L(AccessLevel.READ);
        }

        if(isAdmin(token)) {
            return L(AccessLevel.READ);
        }

        return null;
    }

    public Set<AccessLevel> checkCodeSetAccessPermission(CodeSetAccessInfo codeSetAccessInfo, AccessToken token) {
        Set<AccessLevel> granted = new HashSet<>();
        // Owner of a code set has all permissions on the code set regardless of the Audience
        if(codeSetAccessInfo.getUsername().equals(token.getUsername())) {
            granted.add(AccessLevel.READ);
            granted.add(AccessLevel.WRITE);
        } else {
            Set<AccessLevel> audience = this.checkAudience(codeSetAccessInfo.getAudience(), token);
            if(audience != null) {
                granted.addAll(audience);
            }
        }
        // Committed Code Set Version cannot be WRITTEN to
        if(codeSetAccessInfo.getType().equals(Type.CODESETVERSION) && codeSetAccessInfo.getDateCommitted() != null) {
            granted.remove(AccessLevel.WRITE);
            if(granted.contains(AccessLevel.ALL)) {
                granted.remove(AccessLevel.ALL);
                granted.add(AccessLevel.READ);
            }
        }
        return granted;
    }

    public Set<AccessLevel> checkResourceAccessPermission(ResourceInfo resourceInfo, AccessToken token) throws ResourceNotFoundException {
        // If the resource is an HL7 resource, can READ only
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
            // Grant READ access
            return L(AccessLevel.READ);
        }

        // If the resource is archived
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.ARCHIVED)) {
            // Grant NO access
            return null;
        }

        // If the resource is a user custom element
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.USERCUSTOM)) {
            // If user is the owner
            if(
                    (resourceInfo.getUsername() != null && resourceInfo.getUsername().equals(token.getUsername()))
                            ||
                            (resourceInfo.getParticipants() != null && resourceInfo.getParticipants().contains(token.getUsername()))
            ) {
                // If it's published
                if(resourceInfo.getStatus() != null && resourceInfo.getStatus().equals(Status.PUBLISHED)) {
                    // Grant READ access
                    return L(AccessLevel.READ, AccessLevel.UNLOCK);
                } else {
                    // Grant ALL access
                    return L(AccessLevel.ALL);
                }
            } else {
                return null;
            }
        }

        // If document Info is not available
        if(resourceInfo.getDocumentInfo() == null) {
            // Grant NO access
            return null;
        }

        return this.checkDocumentAccessPermission(
                resourceAccessInfoFetcher.getDocumentAccessInfo(resourceInfo.getDocumentInfo()),
                token
        );
    }

    private Set<AccessLevel> checkAudience(Audience audience, AccessToken token) {
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

    private Set<AccessLevel> checkPrivateAudience(PrivateAudience audience, AccessToken token) {
        // If user is editor
        if(token.getUsername().equals(audience.getEditor())) {
            // Grant all access
            return L(AccessLevel.ALL);
        }

        // If user is viewer
        if(audience.getViewers().contains(token.getUsername())) {
            // Grant user access
            return L(AccessLevel.READ);
        }

        if(isAdmin(token)) {
            return L(AccessLevel.READ);
        }

        return null;
    }

    private Set<AccessLevel> checkPublicAudience(PublicAudience audience, AccessToken token) {
        return L(AccessLevel.READ);
    }

    public Set<AccessLevel> checkWorkspaceAudience(WorkspaceAudience audience, AccessToken token) {
        WorkspacePermissionType permissionType = this.workspacePermissionService.getWorkspacePermissionTypeByFolder(audience.getWorkspaceId(), token.getUsername(), audience.getFolderId());
        if (permissionType != null) {
            switch (permissionType) {
                case EDIT:
                    return L(AccessLevel.ALL);
                case VIEW:
                    return L(AccessLevel.READ);
            }
        }
        if(isAdmin(token)) {
            return L(AccessLevel.READ);
        }
        return null;
    }

    private Set<AccessLevel> L(AccessLevel... levels) {
        return new HashSet<>(Arrays.asList(levels));
    }

    public boolean checkExportConfigurationAccessPermission(String exportConfigurationId, AccessToken token, AccessLevel level) throws ResourceNotFoundException {
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
                return level.equals(AccessLevel.READ);
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

    @Override
    public boolean hasPermission(Type type, String id, AccessLevel level) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        AccessToken currentUser = new AccessToken(usernamePasswordAuthenticationToken.getName(), new HashSet<>(usernamePasswordAuthenticationToken.getAuthorities()));
        try {
            return this.checkResourceAccessPermission(type, id, currentUser, level);
        } catch(Exception e) {
            return false;
        }
    }
}