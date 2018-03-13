package gov.nist.hit.hl7.igamt.legacy.service.impl;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

import gov.nist.hit.hl7.igamt.legacy.config.ApplicationConfig;

public class TestConversion {
	
  public static void main(String[] args) {
	   AbstractApplicationContext context =
		      new AnnotationConfigApplicationContext(ApplicationConfig.class);
	   AccountConversionServiceImpl accountService= context.getBean( AccountConversionServiceImpl.class);
	   accountService.convert();
	//new IgDocumentConversionServiceImpl().convert();
    //new TableConversionServiceImpl().convert();
	

  }

  
  
}
