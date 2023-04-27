package gov.nist.hit.hl7.igamt.access.security;

import gov.nist.hit.hl7.igamt.access.concurrent.SynchronizedAccessService;
import gov.nist.hit.hl7.igamt.access.exception.EditNotSyncException;
import gov.nist.hit.hl7.igamt.access.exception.ResourceAccessDeniedException;
import gov.nist.hit.hl7.igamt.access.model.AccessLevel;
import gov.nist.hit.hl7.igamt.access.model.OpSyncType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Arrays;

public abstract class CustomSecurityExpressionRoot extends SecurityExpressionRoot {

    private final AccessControlService accessControlService;
    private final SynchronizedAccessService synchronizedAccessService;

    public final AccessLevel READ = AccessLevel.READ;
    public final AccessLevel WRITE = AccessLevel.WRITE;
    public final AccessLevel UNLOCK = AccessLevel.UNLOCK;
    public final OpSyncType[] ALLOW_ALL = { OpSyncType.SYNC, OpSyncType.NOT_SYNC, OpSyncType.INCONCLUSIVE };
    public final OpSyncType[] ALLOW_SYNC_STRICT = { OpSyncType.SYNC };
    public final OpSyncType[] ALLOW_SYNC_LENIENT = { OpSyncType.SYNC, OpSyncType.INCONCLUSIVE };


    public CustomSecurityExpressionRoot(Authentication authentication, AccessControlService accessControlService, SynchronizedAccessService synchronizedAccessService) {
        super(authentication);
        this.accessControlService = accessControlService;
        this.synchronizedAccessService = synchronizedAccessService;
    }

    public UsernamePasswordAuthenticationToken getAuthToken() {
        return (UsernamePasswordAuthenticationToken) this.authentication;
    }

    public boolean AccessWorkspace(String id, AccessLevel level)  throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.checkWorkspaceAccessPermission(id, getAuthToken(), level),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action"));
    }

    public boolean IsWorkspaceAdmin(String id)  throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.isWorkspaceAdmin(id, getAuthToken()),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action"));
    }

    public boolean IsWorkspaceOwner(String id)  throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.isWorkspaceOwner(id, getAuthToken()),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action"));
    }

    public boolean AccessWorkspaceFolder(String id, String folderId, AccessLevel level)  throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.checkWorkspaceFolderAccessPermission(id, folderId, getAuthToken(), level),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action"));
    }


    public boolean ConcurrentSync(String type, String id, OpSyncType ...allow) throws ResourceNotFoundException, EditNotSyncException {
        OpSyncType opSyncType = this.synchronizedAccessService.getOperationSyncType(getType(type), id);
        return allowOrException(Arrays.asList(allow).contains(opSyncType),
                new EditNotSyncException("The current version of the document is out-of-date, it has been updated since you opened it or since your last change. Your changes can not be saved, please refresh to get the last version."));
    }

    public boolean AccessResource(String type, String id, AccessLevel level) throws ResourceNotFoundException, ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.checkResourceAccessPermission(getType(type), id, getAuthToken(), level),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action"));
    }

    public boolean AccessConfiguration(String id, AccessLevel level) throws ResourceNotFoundException, ResourceAccessDeniedException  {
        return allowOrException(this.accessControlService.checkExportConfigurationAccessPermission(id, getAuthToken(), level),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action"));
    }

    public boolean CanPublish() throws ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.isPublisher(getAuthToken()),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action"));
    }

    public boolean IsAdmin() throws ResourceAccessDeniedException {
        return allowOrException(this.accessControlService.isAdmin(getAuthToken()),
                new ResourceAccessDeniedException("You do not have permission to access this resource, or perform this action"));
    }

    public Type getType(String type) {
        return Type.fromString(type);
    }

    public <T extends Exception> boolean  allowOrException(boolean allow, T exception) throws T {
        if(allow) return true;
        throw exception;
    }
}