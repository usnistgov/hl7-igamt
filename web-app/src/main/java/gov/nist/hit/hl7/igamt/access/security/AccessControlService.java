package gov.nist.hit.hl7.igamt.access.security;

import gov.nist.hit.hl7.igamt.access.common.ResourceAccessInfoFetcher;
import gov.nist.hit.hl7.igamt.access.model.AccessLevel;
import gov.nist.hit.hl7.igamt.access.model.DocumentAccessInfo;
import gov.nist.hit.hl7.igamt.access.model.ExportConfigurationInfo;
import gov.nist.hit.hl7.igamt.access.model.ResourceInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspacePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class AccessControlService {


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
        if(requested.equals(AccessLevel.READ) && granted.contains(AccessLevel.WRITE)) {
            return true;
        }
        return false;
    }

    public Set<AccessLevel> getDocumentAccessPermission(Type type, String id, UsernamePasswordAuthenticationToken user) throws ResourceNotFoundException {
        return this.checkDocumentAccessPermission(resourceAccessInfoFetcher.getDocument(type, id), user);
    }

    public boolean checkWorkspaceAccessPermission(String id, UsernamePasswordAuthenticationToken user, AccessLevel requested) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        if(this.workspacePermissionService.hasAccessTo(workspace, user.getName())) {
            if(this.workspacePermissionService.isAdmin(workspace, user.getName())) {
                return this.evaluateAccessLevel(L(AccessLevel.ALL), requested);
            } else {
                return this.evaluateAccessLevel(L(AccessLevel.READ), requested);
            }
        } else {
            return false;
        }
    }

    public boolean checkWorkspaceFolderAccessPermission(String id, String folderId, UsernamePasswordAuthenticationToken user, AccessLevel requested) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        WorkspacePermissionType workspacePermissionType = this.workspacePermissionService.getWorkspacePermissionTypeByFolder(workspace, user.getName(), folderId);
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

    public boolean isWorkspaceAdmin(String id, UsernamePasswordAuthenticationToken user) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        return this.workspacePermissionService.isAdmin(workspace, user.getName());
    }

    public boolean isWorkspaceOwner(String id, UsernamePasswordAuthenticationToken user) throws ResourceNotFoundException {
        Workspace workspace = this.resourceAccessInfoFetcher.getWorkspace(id);
        return this.workspacePermissionService.isOwner(workspace, user.getName());
    }


    public boolean checkResourceAccessPermission(Type type, String id, UsernamePasswordAuthenticationToken user, AccessLevel requested) throws ResourceNotFoundException {
        if(resourceAccessInfoFetcher.isDocument(type)) {
            return this.evaluateAccessLevel(this.checkDocumentAccessPermission(resourceAccessInfoFetcher.getDocument(type, id), user), requested);
        } else {
            return this.evaluateAccessLevel(this.checkResourceAccessPermission(resourceAccessInfoFetcher.getResourceInfo(type, id), user), requested);
        }
    }

    public Set<AccessLevel> checkDocumentAccessPermission(DocumentAccessInfo document, UsernamePasswordAuthenticationToken user) {
        // If document is published
        if(document.getStatus() != null && document.getStatus().equals(Status.PUBLISHED)) {
            // Grant READ access
            return L(AccessLevel.READ);
        }

        boolean statusIsArchived = (document.getStatus() != null && document.getStatus().equals(Status.ARCHIVED));
        boolean scopeIsArchived = (document.getDomainInfo() != null && document.getDomainInfo().getScope() != null && document.getDomainInfo().getScope().equals(Scope.ARCHIVED));

        // If document is archived
        if(statusIsArchived || scopeIsArchived) {
            // Grant No access
            return null;
        }

        if(document.getAudience() != null) {
            return this.checkAudience(document.getAudience(), user);
        }

        if(isAdmin(user)) {
            return L(AccessLevel.READ);
        }

        return null;
    }

    public Set<AccessLevel> checkResourceAccessPermission(ResourceInfo resourceInfo, UsernamePasswordAuthenticationToken user) throws ResourceNotFoundException {
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
                    (resourceInfo.getUsername() != null && resourceInfo.getUsername().equals(user.getName()))
                            ||
                            (resourceInfo.getParticipants() != null && resourceInfo.getParticipants().contains(user.getName()))
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
                user
        );
    }

    public Set<AccessLevel> checkAudience(Audience audience, UsernamePasswordAuthenticationToken user) {
        switch (audience.getType()) {
            case PUBLIC:
                return this.checkPublicAudience((PublicAudience) audience, user);
            case PRIVATE:
                return this.checkPrivateAudience((PrivateAudience) audience, user);
            case WORKSPACE:
                return this.checkWorkspaceAudience((WorkspaceAudience) audience, user);
        }
        return null;
    }

    public Set<AccessLevel> checkPrivateAudience(PrivateAudience audience, UsernamePasswordAuthenticationToken user) {
        // If user is editor
        if(user.getName().equals(audience.getEditor())) {
            // Grant all access
            return L(AccessLevel.ALL);
        }

        // If user is viewer
        if(audience.getViewers().contains(user.getName())) {
            // Grant user access
            return L(AccessLevel.READ);
        }

        if(isAdmin(user)) {
            return L(AccessLevel.READ);
        }

        return null;
    }

    public Set<AccessLevel> checkPublicAudience(PublicAudience audience, UsernamePasswordAuthenticationToken user) {
        return L(AccessLevel.READ);
    }

    public Set<AccessLevel> checkWorkspaceAudience(WorkspaceAudience audience, UsernamePasswordAuthenticationToken user) {
        WorkspacePermissionType permissionType = this.workspacePermissionService.getWorkspacePermissionTypeByFolder(audience.getWorkspaceId(), user.getName(), audience.getFolderId());
        if (permissionType != null) {
            switch (permissionType) {
                case EDIT:
                    return L(AccessLevel.ALL);
                case VIEW:
                    return L(AccessLevel.READ);
            }
        }

        if(isAdmin(user)) {
            return L(AccessLevel.READ);
        }
        
        return null;
    }

    private Set<AccessLevel> L(AccessLevel... levels) {
        return new HashSet<>(Arrays.asList(levels));
    }

    public boolean checkExportConfigurationAccessPermission(String exportConfigurationId, UsernamePasswordAuthenticationToken user, AccessLevel level) throws ResourceNotFoundException {
        ExportConfigurationInfo exportConfigurationInfo = resourceAccessInfoFetcher.getExportConfigurationInfo(exportConfigurationId);

        if(exportConfigurationInfo.getUsername() != null && !exportConfigurationInfo.getUsername().isEmpty()) {
            // If user is owner
            if(exportConfigurationInfo.getUsername().equals(user.getName())) {
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

    public boolean isPublisher(UsernamePasswordAuthenticationToken user) {
        return this.isAdmin(user);
    }

    public boolean isAdmin(UsernamePasswordAuthenticationToken user) {
        return user.getAuthorities() != null && user.getAuthorities().stream().anyMatch((a) -> a.getAuthority().equals("ADMIN"));
    }

}