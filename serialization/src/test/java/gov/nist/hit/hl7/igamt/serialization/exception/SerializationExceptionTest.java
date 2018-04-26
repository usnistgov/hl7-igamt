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

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import gov.nist.hit.hl7.igamt.shared.domain.Type;

/**
 *
 * @author Maxence Lefort on Mar 22, 2018.
 */
public class SerializationExceptionTest {

  private final String TEST_EXCEPTION_MESSAGE = "test_exception_message";
  private final Exception TEST_EXCEPTION = new NullPointerException(TEST_EXCEPTION_MESSAGE);
  private final Type TEST_TYPE = Type.COMPONENT;
  private final Type TEST_TYPE_PARENT = Type.DATATYPE;
  private final String TEST_LOCATION = "test_location";
  private final String TEST_LOCATION_PARENT = "test_location_parent";
  private final String TEST_MESSAGE = "test_message";
  private final String TEST_MESSAGE_PARENT = "test_message_parent";
  
  private SerializationException serializationException = new SerializationException(TEST_EXCEPTION,TEST_TYPE,TEST_LOCATION,TEST_MESSAGE);
  
  @Test
  public void testPrintError() {
    String testError = serializationException.printError();
    assertEquals(TEST_TYPE+"["+TEST_LOCATION+"] -> "+TEST_MESSAGE+" => java.lang.NullPointerException -> "+TEST_EXCEPTION_MESSAGE, testError);
  }
  
  @Test
  public void testPrintErrorNullMessage() {
    serializationException.setMessage(null);
    String testError = serializationException.printError();
    assertEquals(TEST_TYPE+"["+TEST_LOCATION+"] => java.lang.NullPointerException -> "+TEST_EXCEPTION_MESSAGE, testError);
  }
  
  @Test
  public void testRecursivePrintError() {
    SerializationException serializationExceptionParent = new SerializationException(serializationException,TEST_TYPE_PARENT,TEST_LOCATION_PARENT,TEST_MESSAGE_PARENT);
    String testError = serializationExceptionParent.printError();
    assertEquals(TEST_TYPE_PARENT+"["+TEST_LOCATION_PARENT+"] -> "+TEST_MESSAGE_PARENT+" => "+TEST_TYPE+"["+TEST_LOCATION+"] -> "+TEST_MESSAGE+" => java.lang.NullPointerException -> "+TEST_EXCEPTION_MESSAGE, testError);
  }
}