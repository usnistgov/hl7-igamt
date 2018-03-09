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
package gov.nist.hit.hl7.legacy.util;

import static org.junit.Assert.*;

import org.junit.Test;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant.SCOPE;
import gov.nist.hit.hl7.igamt.legacy.service.impl.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;
import gov.nist.hit.hl7.igamt.shared.domain.Usage;

/**
 *
 * @author Maxence Lefort on Mar 8, 2018.
 */
public class ConversionUtilTest {

  @Test
  public void testConvertScope() {
    assertEquals(Scope.ARCHIVED, ConversionUtil.convertScope(SCOPE.ARCHIVED));
    assertEquals(Scope.HL7STANDARD, ConversionUtil.convertScope(SCOPE.HL7STANDARD));
    assertEquals(Scope.INTERMASTER, ConversionUtil.convertScope(SCOPE.INTERMASTER));
    assertEquals(Scope.MASTER, ConversionUtil.convertScope(SCOPE.MASTER));
    assertEquals(Scope.PHINVADS, ConversionUtil.convertScope(SCOPE.PHINVADS));
    assertEquals(Scope.PRELOADED, ConversionUtil.convertScope(SCOPE.PRELOADED));
    assertEquals(Scope.USER, ConversionUtil.convertScope(SCOPE.USER));
  }
  
  @Test
  public void testConvertUsage() {
    assertEquals(Usage.B,ConversionUtil.convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.B));
    assertEquals(Usage.C,ConversionUtil.convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.C));
    assertEquals(Usage.CE,ConversionUtil.convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.CE));
    assertEquals(Usage.O,ConversionUtil.convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.O));
    assertEquals(Usage.R,ConversionUtil.convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.R));
    assertEquals(Usage.RE,ConversionUtil.convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.RE));
    assertEquals(Usage.W,ConversionUtil.convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.W));
    assertEquals(Usage.X,ConversionUtil.convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.X));
  }
  
}
