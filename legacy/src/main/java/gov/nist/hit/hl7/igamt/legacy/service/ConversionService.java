package gov.nist.hit.hl7.igamt.legacy.service;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant.SCOPE;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DataModelWithConstraints;
import gov.nist.hit.hl7.igamt.legacy.config.ApplicationConfig;
import gov.nist.hit.hl7.igamt.legacy.config.LegacyApplicationConfig;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;

public abstract class ConversionService {
  static AbstractApplicationContext context =
      new AnnotationConfigApplicationContext(ApplicationConfig.class);
  static AbstractApplicationContext legacyContext =
      new AnnotationConfigApplicationContext(LegacyApplicationConfig.class);
  public abstract void convert();
  
  protected Scope convertScope(SCOPE scope) {
    if(scope.equals(SCOPE.HL7STANDARD)) {
      return Scope.HL7STANDARD;
    } else if (scope.equals(SCOPE.ARCHIVED)) {
      return Scope.ARCHIVED;
    } else if (scope.equals(SCOPE.INTERMASTER)) {
      return Scope.INTERMASTER;
    } else if (scope.equals(SCOPE.MASTER)) {
      return Scope.MASTER;
    } else if (scope.equals(SCOPE.PHINVADS)) {
      return Scope.PHINVADS;
    } else if (scope.equals(SCOPE.PRELOADED)) {
      return Scope.PRELOADED;
    } else if (scope.equals(SCOPE.USER)) {
      return Scope.USER;
    }
    return null;
  }
  
}
