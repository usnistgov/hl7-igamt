package gov.nist.hit.hl7.igamt.access.configuration;

import gov.nist.hit.hl7.igamt.access.concurrent.SynchronizedAccessService;
import gov.nist.hit.hl7.igamt.access.security.AccessControlService;
import gov.nist.hit.hl7.igamt.access.security.CustomMethodSecurityExpressionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AccessControlConfiguration extends GlobalMethodSecurityConfiguration {

    @Autowired
    AccessControlService accessControlService;
    @Autowired
    SynchronizedAccessService synchronizedAccessService;

    @Override
    protected MethodSecurityExpressionHandler createExpressionHandler() {
        return new CustomMethodSecurityExpressionHandler(accessControlService, synchronizedAccessService);
    }

}