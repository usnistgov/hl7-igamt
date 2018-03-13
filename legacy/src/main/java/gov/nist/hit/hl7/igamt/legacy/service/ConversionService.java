package gov.nist.hit.hl7.igamt.legacy.service;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.legacy.config.ApplicationConfig;
import gov.nist.hit.hl7.igamt.legacy.config.LegacyApplicationConfig;
import gov.nist.hit.hl7.igamt.legacy.config.UserMongoClient;
@Service
public interface ConversionService {
  static AbstractApplicationContext context =
      new AnnotationConfigApplicationContext(ApplicationConfig.class);
  static AbstractApplicationContext legacyContext =
      new AnnotationConfigApplicationContext(LegacyApplicationConfig.class);
  
  static AbstractApplicationContext userContext =
	      new AnnotationConfigApplicationContext(UserMongoClient.class);

  public void convert();
}
