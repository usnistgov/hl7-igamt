package gov.nist.hit.hl7.igamt.legacy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

import gov.nist.hit.hl7.auth.config.MongoConfig;
import gov.nist.hit.hl7.auth.service.AccountService;
import gov.nist.hit.hl7.igamt.legacy.repository.ProfileComponentRepository;
import gov.nist.hit.hl7.igamt.legacy.service.config.ApplicationConfig;
import gov.nist.hit.hl7.igamt.legacy.service.config.LegacyApplicationConfig;

public interface ConversionService {
  static AbstractApplicationContext context =
      new AnnotationConfigApplicationContext(ApplicationConfig.class);
  static AbstractApplicationContext legacyContext =
      new AnnotationConfigApplicationContext(LegacyApplicationConfig.class);
  static AbstractApplicationContext userContext =
	      new AnnotationConfigApplicationContext(MongoConfig.class);
  

  
  
  public abstract void convert();

}
