package gov.nist.hit.hl7.igamt.access.security;

import gov.nist.hit.hl7.igamt.access.model.AccessLevel;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

public abstract class CustomSecurityExpressionRoot extends SecurityExpressionRoot {

    private final AccessControlService accessControlService;
    public final AccessLevel READ = AccessLevel.READ;
    public final AccessLevel WRITE = AccessLevel.WRITE;
    public final AccessLevel UNLOCK = AccessLevel.UNLOCK;

    public CustomSecurityExpressionRoot(Authentication authentication, AccessControlService accessControlService) {
        super(authentication);
        this.accessControlService = accessControlService;
    }

    public UsernamePasswordAuthenticationToken getAuthToken() {
        return (UsernamePasswordAuthenticationToken) this.authentication;
    }

    public boolean AccessResource(String type, String id, AccessLevel level) {
        try {
            return this.accessControlService.checkResourceAccessPermission(getType(type), id, getAuthToken(), level);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean AccessConfiguration(String id, AccessLevel level) {
        try {
            return this.accessControlService.checkExportConfigurationAccessPermission(id, getAuthToken(), level);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Type getType(String type) {
        return Type.fromString(type);
    }
}