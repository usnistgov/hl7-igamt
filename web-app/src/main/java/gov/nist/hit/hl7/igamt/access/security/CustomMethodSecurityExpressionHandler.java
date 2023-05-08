package gov.nist.hit.hl7.igamt.access.security;

import gov.nist.hit.hl7.igamt.access.concurrent.SynchronizedAccessService;
import org.aopalliance.intercept.MethodInvocation;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.core.Authentication;

public class CustomMethodSecurityExpressionHandler extends DefaultMethodSecurityExpressionHandler {
    private final AuthenticationTrustResolver trustResolver = new AuthenticationTrustResolverImpl();
    private final AccessControlService accessControlService;
    private final SynchronizedAccessService synchronizedAccessService;

    public CustomMethodSecurityExpressionHandler(AccessControlService accessControlService, SynchronizedAccessService synchronizedAccessService){
        this.accessControlService = accessControlService;
        this.synchronizedAccessService = synchronizedAccessService;
    }

    @Override
    protected MethodSecurityExpressionOperations createSecurityExpressionRoot(Authentication authentication, MethodInvocation invocation) {
        CustomMethodSecurityExpressionRoot root = new CustomMethodSecurityExpressionRoot(authentication, accessControlService, synchronizedAccessService);
        root.setPermissionEvaluator(getPermissionEvaluator());
        root.setTrustResolver(this.trustResolver);
        root.setRoleHierarchy(getRoleHierarchy());
        return root;
    }
}