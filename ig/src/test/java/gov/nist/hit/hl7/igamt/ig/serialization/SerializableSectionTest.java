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
package gov.nist.hit.hl7.igamt.ig.serialization;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 5, 2018.
 */
public class SerializableSectionTest {

  private final static String TEST_DESCRIPTION = "test_description";
  private final static String TEST_ID = "test_id";
  private final static String TEST_LABEL = "test_label";
  private final static int TEST_POSITION = 1;
  private final static Type TEST_TYPE = Type.COMPONENT;
  private final static String TEST_ELEMENT_NAME = "Section";

  public static Section getSectionTest() {
    Section section = new Section();
    section.setDescription(TEST_DESCRIPTION);
    section.setId(TEST_ID);
    section.setLabel(TEST_LABEL);
    section.setPosition(TEST_POSITION);
    section.setType(TEST_TYPE);
    return section;
  }

  @Test
  public void testSerialize() throws SerializationException {
    Section section = getSectionTest();
    SerializableSection serializableSection = new SerializableSection(section) {
      @Override
      public Element serialize() throws SerializationException {
        return this.getElement();
      }
    };
    Element testElement = serializableSection.serialize();
    assertEquals(TEST_DESCRIPTION, testElement.getAttribute("description").getValue());
    assertEquals(TEST_ID, testElement.getAttribute("id").getValue());
    assertEquals(TEST_LABEL, testElement.getAttribute("title").getValue());
    assertEquals(String.valueOf(TEST_POSITION), testElement.getAttribute("position").getValue());
    assertEquals(TEST_TYPE.name(), testElement.getAttribute("type").getValue());
    assertEquals(TEST_ELEMENT_NAME, testElement.getLocalName());
  }
}
