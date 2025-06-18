package gov.nist.hit.hl7.igamt.access.security;

import gov.nist.hit.hl7.igamt.access.concurrent.SynchronizedAccessService;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;

public class CustomMethodSecurityExpressionRoot extends CustomSecurityExpressionRoot implements MethodSecurityExpressionOperations {
    private Object filterObject;
    private Object returnObject;

    public CustomMethodSecurityExpressionRoot(Authentication authentication, AccessControlService accessControlService, SynchronizedAccessService synchronizedAccessService, APIAccessControlService apiAccessControlService) {
        super(authentication, accessControlService, synchronizedAccessService, apiAccessControlService);
    }

    @Override
    public void setFilterObject(Object filterObject) {
        this.filterObject = filterObject;
    }

    @Override
    public Object getFilterObject() {
        return this.filterObject;
    }

    @Override
    public void setReturnObject(Object returnObject) {
        this.returnObject = returnObject;
    }

    @Override
    public Object getReturnObject() {
        return returnObject;
    }

    @Override
    public Object getThis() {
        return this;
    }
}