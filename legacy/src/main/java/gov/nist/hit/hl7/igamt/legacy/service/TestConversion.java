package gov.nist.hit.hl7.igamt.legacy.service;

import gov.nist.hit.hl7.igamt.legacy.service.impl.compositeprofilestructure.CompositeProfileStructureConversionServiceImpl;
import gov.nist.hit.hl7.igamt.legacy.service.impl.conformanceprofile.ConformanceProfileConversionServiceImpl;
import gov.nist.hit.hl7.igamt.legacy.service.impl.datatype.DatatypeConversionServiceImpl;
import gov.nist.hit.hl7.igamt.legacy.service.impl.igdocument.IgDocumentConversionServiceImpl;
import gov.nist.hit.hl7.igamt.legacy.service.impl.segment.SegmentConversionServiceImpl;
import gov.nist.hit.hl7.igamt.legacy.service.impl.valueset.TableConversionServiceImpl;


public class TestConversion {
	
  public static void main(String[] args) {
   new TableConversionServiceImpl().convert();
   new DatatypeConversionServiceImpl().convert();
   new SegmentConversionServiceImpl().convert();
   new ConformanceProfileConversionServiceImpl().convert();
   new CompositeProfileStructureConversionServiceImpl().convert();
   new IgDocumentConversionServiceImpl().convert();
   

  }

  
  
}
