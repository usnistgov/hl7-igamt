package gov.nist.hit.hl7.igamt.legacy.service;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

import gov.nist.hit.hl7.igamt.legacy.service.config.ApplicationConfig;
import gov.nist.hit.hl7.igamt.legacy.service.config.LegacyApplicationConfig;

public interface ConversionService {
  static AbstractApplicationContext context =
      new AnnotationConfigApplicationContext(ApplicationConfig.class);
  static AbstractApplicationContext legacyContext =
      new AnnotationConfigApplicationContext(LegacyApplicationConfig.class);
  public abstract void convert();
  
  
  
}
