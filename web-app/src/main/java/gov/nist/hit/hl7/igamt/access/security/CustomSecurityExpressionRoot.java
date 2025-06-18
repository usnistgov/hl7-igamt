package gov.nist.hit.hl7.igamt.access.security;

import gov.nist.hit.hl7.igamt.access.concurrent.SynchronizedAccessService;
import gov.nist.hit.hl7.igamt.access.exception.APIResourceNotFoundException;
import gov.nist.hit.hl7.igamt.access.exception.EditNotSyncException;
import gov.nist.hit.hl7.igamt.access.exception.ResourceAPIAccessDeniedException;
import gov.nist.hit.hl7.igamt.access.exception.ResourceAccessDeniedException;
import gov.nist.hit.hl7.igamt.access.model.Action;
import gov.nist.hit.hl7.igamt.access.model.AccessToken;
import gov.nist.hit.hl7.igamt.access.model.OpSyncType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Arrays;
import java.util.HashSet;

public abstract class CustomSecurityExpressionRoot extends SecurityExpressionRoot {

    private final AccessControlService accessControlService;
    private final APIAccessControlService apiAccessControlService;
    private final SynchronizedAccessService synchronizedAccessService;

    public final Action READ = Action.READ;
    public final Action WRITE = Action.WRITE;
    public final Action UNLOCK = Action.UNLOCK;
    public final OpSyncType[] ALLOW_ALL = { OpSyncType.SYNC, OpSyncType.NOT_SYNC, OpSyncType.INCONCLUSIVE };
    public final OpSyncType[] ALLOW_SYNC_STRICT = { OpSyncType.SYNC };
    public final OpSyncType[] ALLOW_SYNC_LENIENT = { OpSyncType.SYNC, OpSyncType.INCONCLUSIVE };


    public CustomSecurityExpressionRoot(Authentication authentication, AccessControlService accessControlService, SynchronizedAccessService synchronizedAccessService, APIAccessControlService apiAccessControlService) {
        super(authentication);
        this.accessControlService = accessControlService;
        this.synchronizedAccessService = synchronizedAccessService;
        this.apiAccessControlService = apiAccessControlService;
    }

    public AccessToken requiresAccessToken() throws ResourceAccessDeniedException {
        if(this.authentication instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = (UsernamePasswordAuthenticationToken) this.authentication;
            return new AccessToken(usernamePasswordAuthenticationToken.getName(), new HashSet<>(usernamePasswordAuthenticationToken.getAuthorities()));
        }
        throw new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action.");
    }

    public boolean AccessWorkspace(String id, Action level)  throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.checkWorkspaceAccessPermission(id, requiresAccessToken(), level),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action."));
    }

    public boolean IsWorkspaceAdmin(String id)  throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.isWorkspaceAdmin(id, requiresAccessToken()),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action."));
    }

    public boolean IsWorkspaceOwner(String id)  throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.isWorkspaceOwner(id, requiresAccessToken()),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action."));
    }

    public boolean AccessWorkspaceFolder(String id, String folderId, Action level)  throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.checkWorkspaceFolderAccessPermission(id, folderId, requiresAccessToken(), level),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action."));
    }


    public boolean ConcurrentSync(String type, String id, OpSyncType ...allow) throws ResourceNotFoundException, EditNotSyncException {
        OpSyncType opSyncType = this.synchronizedAccessService.getOperationSyncType(getType(type), id);
        return allowOrException(Arrays.asList(allow).contains(opSyncType),
                new EditNotSyncException("The current version of the document is out-of-date, it has been updated since you opened it or since your last change. Your changes can not be saved, please refresh to get the last version."));
    }

    public boolean AccessResource(String type, String id, Action level) throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.checkResourceAccessPermission(getType(type), id, requiresAccessToken(), level),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action."));
    }

    public boolean AccessConfiguration(String id, Action level) throws ResourceNotFoundException, ResourceAccessDeniedException  {
        return allowOrException(this.accessControlService.checkExportConfigurationAccessPermission(id, requiresAccessToken(), level),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action."));
    }

    public boolean CanPublish() throws ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.isPublisher(requiresAccessToken()),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action."));
    }

    public boolean APIAccess(String type, String id, Action level) throws ResourceAPIAccessDeniedException, APIResourceNotFoundException {
        return allowOrException(this.apiAccessControlService.checkResourceAPIAccessPermission(getType(type), id, level),
                                new ResourceAPIAccessDeniedException("You do not have permission to access this resource."));
    }

    public boolean IsAdmin() throws ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.isAdmin(requiresAccessToken()),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action."));
    }

    public Type getType(String type) {
        return Type.fromString(type);
    }

    public <T extends Exception> boolean  allowOrException(boolean allow, T exception) throws T {
        if(allow) return true;
        throw exception;
    }
}