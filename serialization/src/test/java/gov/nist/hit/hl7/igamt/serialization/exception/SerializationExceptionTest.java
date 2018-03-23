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
package gov.nist.hit.hl7.igamt.serialization.exception;

import org.junit.Test;

import gov.nist.hit.hl7.igamt.shared.domain.Type;

import static org.junit.Assert.*;

/**
 *
 * @author Maxence Lefort on Mar 22, 2018.
 */
public class SerializationExceptionTest {

  private final String TEST_EXCEPTION_MESSAGE = "test_exception_message";
  private final Exception TEST_EXCEPTION = new NullPointerException(TEST_EXCEPTION_MESSAGE);
  private final Type TEST_TYPE = Type.COMPONENT;
  private final String TEST_LOCATION = "test_location";
  private final String TEST_MESSAGE = "test_message";

  
  @Test
  public void testPrintError() {
    SerializationException serializationException = new SerializationException(TEST_EXCEPTION,TEST_TYPE,TEST_LOCATION,TEST_MESSAGE);
    String testError = serializationException.printError();
    assertEquals(TEST_TYPE+"["+TEST_LOCATION+"] => "+TEST_EXCEPTION.getClass()+" -> "+TEST_EXCEPTION_MESSAGE, testError);
  }
}