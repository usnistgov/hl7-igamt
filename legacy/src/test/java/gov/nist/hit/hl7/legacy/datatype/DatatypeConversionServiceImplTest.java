/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.legacy.datatype;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.junit.runner.RunWith;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.legacy.service.impl.datatype.DatatypeConversionServiceImpl;

/**
 *
 * @author Maxence Lefort on Mar 5, 2018.
 */
//@ActiveProfiles({ "test", "unit" })
//@RunWith(SpringJUnit4ClassRunner.class)
public class DatatypeConversionServiceImplTest {

  @Test
  public void testConvert() {
    String testId = "57450d0fd4c6f57e694edfa8";
    
    Datatype oldDatatype = new DatatypeConversionServiceImpl().findOldDatatype(testId);
    gov.nist.hit.hl7.igamt.datatype.domain.Datatype newDatatype = new DatatypeConversionServiceImpl().convert(testId);
    assertEquals("ID should be same!", oldDatatype.getId(), newDatatype.getId().getId());
    
    if(newDatatype instanceof ComplexDatatype) {
      assertEquals("Number of Components mismached.", oldDatatype.getComponents().size(), ((ComplexDatatype)newDatatype).getComponents().size());
    }
  }
}
