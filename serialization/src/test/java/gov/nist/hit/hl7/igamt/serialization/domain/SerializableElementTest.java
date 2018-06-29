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
package gov.nist.hit.hl7.igamt.serialization.domain;

import org.junit.Test;
import static org.junit.Assert.*;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 20, 2018.
 */
public class SerializableElementTest {
  
  private static final String ID_TEST = "id_test";
  private static final String TITLE_TEST = "title_test";
  private static final String POSITION_TEST = "14";

  public static SerializableElement getTestElement() {
    SerializableElement serializableElement = new SerializableElement(ID_TEST,POSITION_TEST,TITLE_TEST) {
      
      @Override
      public Element serialize() {
        return this.getElement(Type.SECTION);
      }
    };
    return serializableElement;
  }

  @Test
  public void testSerialize() throws SerializationException {
    Element testElement = getTestElement().serialize();
    assertEquals(3,testElement.getAttributeCount());
    assertEquals(ID_TEST, testElement.getAttribute("id").getValue());
    assertEquals(TITLE_TEST, testElement.getAttribute("title").getValue());
    assertEquals(POSITION_TEST, testElement.getAttribute("position").getValue());
    assertEquals("Section", testElement.getQualifiedName());
  }
}
