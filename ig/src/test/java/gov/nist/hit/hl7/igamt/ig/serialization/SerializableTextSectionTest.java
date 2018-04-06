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

import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.Test;

import gov.nist.hit.hl7.igamt.ig.serialization.sections.SerializableTextSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 5, 2018.
 */
public class SerializableTextSectionTest {
  
  private final String TEST_PARENT_ID = "test_parent_id";

  @Test
  public void testSerialize() throws SerializationException {
    Section section1 = SerializableSectionTest.getSectionTest();
    Section section2 = SerializableSectionTest.getSectionTest();
    TextSection textSection = new TextSection();
    textSection.setDescription(section1.getDescription());
    textSection.setId(section1.getId());
    textSection.setLabel(section1.getLabel());
    textSection.setPosition(section1.getPosition());
    textSection.setType(Type.TEXT);
    textSection.setChildren(Stream.of(section1,section2).collect(Collectors.toSet()));
    textSection.setParentId(TEST_PARENT_ID);
    SerializableTextSection serializableTextSection = new SerializableTextSection(textSection);
    Element testElement = serializableTextSection.serialize();
    assertEquals(2, testElement.getChildCount());
  }
}
