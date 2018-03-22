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
package gov.nist.hit.hl7.igamt.serialization;

import java.util.Date;

import org.junit.Test;

import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;

import static org.junit.Assert.*;

/**
 *
 * @author Maxence Lefort on Mar 22, 2018.
 */
public class DateSerializationUtilTest {

  private final long DATE_IN_MILLIS = 1521731130187L;
  private final String FORMATED_DATE = "03/22/2018";
  
  @Test
  public void testSerializeDate() {
    Date date = new Date(DATE_IN_MILLIS);
    assertEquals(FORMATED_DATE, DateSerializationUtil.serializeDate(date));
  }
}
