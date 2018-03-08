package gov.nist.hit.hl7.igamt.legacy.service;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant.SCOPE;
import gov.nist.hit.hl7.igamt.legacy.config.ApplicationConfig;
import gov.nist.hit.hl7.igamt.legacy.config.LegacyApplicationConfig;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;

public interface ConversionService {
  static AbstractApplicationContext context =
      new AnnotationConfigApplicationContext(ApplicationConfig.class);
  static AbstractApplicationContext legacyContext =
      new AnnotationConfigApplicationContext(LegacyApplicationConfig.class);
  public abstract void convert();
  
  
  
}
