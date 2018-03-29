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
package gov.nist.hit.hl7.igamt.datatype.test.serialization;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.junit.Test;

import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatype;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Component;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.Usage;
import gov.nist.hit.hl7.igamt.shared.domain.exception.DatatypeNotFoundException;
import nu.xom.Element;
import nu.xom.Elements;

/**
 *
 * @author Maxence Lefort on Mar 19, 2018.
 */
public class SerializableDatatypeTest {

  private static final String TEST_EXT = "test_ext";
  private static final String TEST_PURPOSE_AND_USE = "test_purpose_and_use";
  private static final String TEST_POSTION = "123";
  private static final String TEST_NAME = "test_name";
  private static final String TEST_ID = "test_id";
  
  private static final String TEST_COMPONENT1_NAME = "test_component1_name";
  private static final String TEST_COMPONENT1_CONF_LENGTH = "test_component1_conf_length";
  private static final String TEST_COMPONENT1_ID = "test_component1_id";
  private static final String TEST_COMPONENT1_MAX_LENGTH = "test_component1_max_length";
  private static final String TEST_COMPONENT1_MIN_LENGTH = "test_component1_min_length";
  private static final int TEST_COMPONENT1_POSTION = 111;
  private static final String TEST_COMPONENT1_TEXT = "test_component1_text";
  private static final Usage TEST_COMPONENT1_USAGE = Usage.R;
  private static final String TEST_COMPONENT1_REF_ID = "test_component1_ref_id";
  private static final String TEST_COMPONENT1_REF_LABEL = "test_component1_ref_label";
  private static final Ref REF_COMPONENT1 = new Ref(TEST_COMPONENT1_REF_ID);


  
  
  
  @Test
  public void testSerializeDatatype() throws ResourceSerializationException {
    Datatype datatype = new Datatype();
    datatype.setName(TEST_NAME);
    datatype.setId(new CompositeKey(TEST_ID));
    datatype.setExt(TEST_EXT);
    datatype.setPurposeAndUse(TEST_PURPOSE_AND_USE);
    SerializableDatatype serializableDatatype = new SerializableDatatype(datatype,TEST_POSTION);
    Element testElement = serializableDatatype.serialize();
    assertEquals(TEST_EXT, testElement.getAttribute("ext").getValue());
    assertEquals(TEST_PURPOSE_AND_USE, testElement.getAttribute("purposeAndUse").getValue());
    assertEquals(TEST_POSTION, testElement.getAttribute("position").getValue());
  }
  
  private ComplexDatatype getComplexDatatype() {
    ComplexDatatype datatype = new ComplexDatatype();
    datatype.setName(TEST_NAME);
    datatype.setId(new CompositeKey(TEST_ID));
    Set<Component> components = new HashSet<>();
    Component component1 = new Component();
    component1.setName(TEST_COMPONENT1_NAME);
    component1.setConfLength(TEST_COMPONENT1_CONF_LENGTH);
    component1.setId(TEST_COMPONENT1_ID);
    component1.setMaxLength(TEST_COMPONENT1_MAX_LENGTH);
    component1.setMinLength(TEST_COMPONENT1_MIN_LENGTH);
    component1.setPosition(TEST_COMPONENT1_POSTION);
    component1.setRef(REF_COMPONENT1);
    component1.setText(TEST_COMPONENT1_TEXT);
    component1.setUsage(TEST_COMPONENT1_USAGE);
    components.add(component1);
    datatype.setComponents(components);
    return datatype;
  }

  @Test
  public void testSerializeComplexDatatype() throws ResourceSerializationException {
    Datatype datatype = getComplexDatatype();
    HashMap<Ref, String> refDatatypeLabel = new HashMap<>();
    refDatatypeLabel.put(REF_COMPONENT1, TEST_COMPONENT1_REF_LABEL);
    SerializableDatatype serializableDatatype = new SerializableDatatype(datatype,TEST_POSTION,refDatatypeLabel);
    Element testElement = serializableDatatype.serialize();
    Elements componentElements = testElement.getChildElements("Component");
    assertEquals(1, componentElements.size());
    Element testComponent = componentElements.get(0);
    assertEquals(TEST_COMPONENT1_NAME, testComponent.getAttribute("name").getValue());
    assertEquals(TEST_COMPONENT1_CONF_LENGTH, testComponent.getAttribute("confLength").getValue());
    assertEquals(TEST_COMPONENT1_ID, testComponent.getAttribute("id").getValue());
    assertEquals(TEST_COMPONENT1_MAX_LENGTH, testComponent.getAttribute("maxLength").getValue());
    assertEquals(TEST_COMPONENT1_MIN_LENGTH, testComponent.getAttribute("minLength").getValue());
    assertEquals(String.valueOf(TEST_COMPONENT1_POSTION), testComponent.getAttribute("position").getValue());
    assertEquals(TEST_COMPONENT1_REF_LABEL, testComponent.getAttribute("datatype").getValue());
    assertEquals(TEST_COMPONENT1_TEXT, testComponent.getAttribute("text").getValue());
    assertEquals(TEST_COMPONENT1_USAGE.name(), testComponent.getAttribute("usage").getValue());
  }
  
  @Test(expected = ResourceSerializationException.class)
  public void testSerializeComplexDatatypeMissingRef() throws ResourceSerializationException {
    ComplexDatatype datatype = getComplexDatatype();
    //Call serialization with no ref/datatype map to make it fail with a DatatypeNotFoundException
    SerializableDatatype serializableDatatype = new SerializableDatatype(datatype,TEST_POSTION);
    try {
      serializableDatatype.serialize();
    } catch (ResourceSerializationException e) {
      assertTrue(e.getOriginException() instanceof SubStructElementSerializationException);
      assertTrue(((SubStructElementSerializationException)e.getOriginException()).getOriginException() instanceof DatatypeNotFoundException);
      throw e;
    }
  }

  @Test
  public void testSerializeDateTimeDatatype() throws ResourceSerializationException {
    DateTimeDatatype datatype = new DateTimeDatatype();
    datatype.setName(TEST_NAME);
    datatype.setId(new CompositeKey(TEST_ID));
    //TODO add DT test
    //SerializableDatatype serializableDatatype = new SerializableDatatype(datatype,TEST_POSTION);
    //Element testElement = serializableDatatype.serialize();
  }

}
