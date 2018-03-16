package gov.nist.hit.hl7.igamt.legacy.service.impl.vlaueset;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

import gov.nist.hit.hl7.igamt.legacy.service.config.ApplicationConfig;
import gov.nist.hit.hl7.igamt.legacy.service.impl.igdocument.IgDocumentConversionServiceImpl;


public class TestConversion {
	
  public static void main(String[] args) {
	   AbstractApplicationContext context =
		      new AnnotationConfigApplicationContext(ApplicationConfig.class);
   new TableConversionServiceImpl().convert();
	

  }

  
  
}
