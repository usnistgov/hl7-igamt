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
package gov.nist.hit.hl7.segment.serialization;

import static org.junit.Assert.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.junit.Test;

import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.serialization.SerializableSegment;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.shared.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.shared.domain.Field;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.Usage;
import gov.nist.hit.hl7.igamt.shared.domain.exception.DatatypeNotFoundException;
import nu.xom.Element;
import nu.xom.Elements;

/**
 *
 * @author Maxence Lefort on Mar 27, 2018.
 */
public class SerializableSegmentTest {
  
  private static final String TEST_POSTION = "123";
  private static final String TEST_NAME = "test_name";
  private static final String TEST_ID = "test_id";
  private static final String TEST_EXT = "test_ext";
  private static final String TEST_DM1_DT_ID = "test_dm1_dt_id";
  private static final String TEST_DM1_DT_NAME = "test_dm1_dt_name";
  private static final String TEST_DM1_VALUE = "test_dm1_value";
  private static final String TEST_DM2_DT_ID = "test_dm2_dt_id";
  private static final String TEST_DM2_DT_NAME = "test_dm2_dt_name";
  private static final String TEST_DM2_VALUE = "test_dm2_value";
  private static final DynamicMappingItem TEST_DM_ITEM1 = new DynamicMappingItem(TEST_DM1_DT_ID,TEST_DM1_VALUE);
  private static final DynamicMappingItem TEST_DM_ITEM2 = new DynamicMappingItem(TEST_DM2_DT_ID,TEST_DM2_VALUE);
  private static final String TEST_DM_REF_PATH = "test_dm_ref_path";
  private static final String TEST_DM_VARIES_DT_PATH = "test_dm_varies_dt_path";
  private static final DynamicMappingInfo TEST_DM = new DynamicMappingInfo(TEST_DM_REF_PATH, TEST_DM_VARIES_DT_PATH, new HashSet<DynamicMappingItem>(Arrays.asList(TEST_DM_ITEM1,TEST_DM_ITEM2)));

  //field1
  private static final String TEST_FIELD1_NAME = "test_field1_name";
  private static final String TEST_FIELD1_ID = "test_field1_id";
  private static final int TEST_FIELD1_POSITION = 1;
  private static final Usage TEST_FIELD1_USAGE = Usage.R;
  private static final String TEST_FIELD1_TEXT = "test_field1_text";
  private static final boolean TEST_FIELD1_CUSTOM = false;
  private static final String TEST_FIELD1_MAXLENGTH = "test_field1_max_length";
  private static final String TEST_FIELD1_MINLENGTH = "test_field1_min_length";
  private static final String TEST_FIELD1_CONFLENGTH = "test_field1_conf_length";
  private static final String TEST_FIELD1_DT_ID = "test_field1_dt_id";
  private static final String TEST_FIELD1_DT_NAME = "test_field1_dt_name";
  private static final Ref TEST_FIELD1_REF = new Ref(TEST_FIELD1_DT_ID);
  private static final int TEST_FIELD1_MIN = 1;
  private static final String TEST_FIELD1_MAX = "5";
  private static final Field TEST_FIELD1 = new Field(TEST_FIELD1_ID, TEST_FIELD1_NAME, TEST_FIELD1_POSITION, TEST_FIELD1_USAGE,
      TEST_FIELD1_TEXT, TEST_FIELD1_CUSTOM, TEST_FIELD1_MAXLENGTH, TEST_FIELD1_MINLENGTH, 
      TEST_FIELD1_CONFLENGTH, TEST_FIELD1_REF, TEST_FIELD1_MIN, TEST_FIELD1_MAX);
  
//field2
  private static final String TEST_FIELD2_NAME = "test_field2_name";
  private static final String TEST_FIELD2_ID = "test_field2_id";
  private static final int TEST_FIELD2_POSITION = 2;
  private static final Usage TEST_FIELD2_USAGE = Usage.R;
  private static final String TEST_FIELD2_TEXT = "test_field2_text";
  private static final boolean TEST_FIELD2_CUSTOM = false;
  private static final String TEST_FIELD2_MAXLENGTH = "test_field2_max_length";
  private static final String TEST_FIELD2_MINLENGTH = "test_field2_min_length";
  private static final String TEST_FIELD2_CONFLENGTH = "test_field2_conf_length";
  private static final String TEST_FIELD2_DT_ID = "test_field2_dt_id";
  private static final String TEST_FIELD2_DT_NAME = "test_field2_dt_name";
  private static final Ref TEST_FIELD2_REF = new Ref(TEST_FIELD2_DT_ID);
  private static final int TEST_FIELD2_MIN = 0;
  private static final String TEST_FIELD2_MAX = "13";
  private static final Field TEST_FIELD2 = new Field(TEST_FIELD2_ID, TEST_FIELD2_NAME, TEST_FIELD2_POSITION, TEST_FIELD2_USAGE,
      TEST_FIELD2_TEXT, TEST_FIELD2_CUSTOM, TEST_FIELD2_MAXLENGTH, TEST_FIELD2_MINLENGTH, 
      TEST_FIELD2_CONFLENGTH, TEST_FIELD2_REF, TEST_FIELD2_MIN, TEST_FIELD2_MAX);
  
  
  private static final Set<Field> TEST_CHILDREN = new HashSet<Field>(Arrays.asList(TEST_FIELD1,TEST_FIELD2));
  
  private Segment getSegment() {
    Segment segment = new Segment();
    segment.setId(new CompositeKey(TEST_ID));
    segment.setName(TEST_NAME);
    segment.setExt(TEST_EXT);
    segment.setDynamicMappingInfo(TEST_DM);
    segment.setChildren(TEST_CHILDREN);
    return segment;
  }
  
  @Test
  public void testSerializeSegment() throws SerializationException {
    Segment segment = getSegment();
    Map<String,String> datatypesMap = new HashMap<>();
    datatypesMap.put(TEST_FIELD1_DT_ID, TEST_FIELD1_DT_NAME);
    datatypesMap.put(TEST_FIELD2_DT_ID, TEST_FIELD2_DT_NAME);
    datatypesMap.put(TEST_DM1_DT_ID, TEST_DM1_DT_NAME);
    datatypesMap.put(TEST_DM2_DT_ID, TEST_DM2_DT_NAME);
    SerializableSegment serializableSegment = new SerializableSegment(segment, TEST_POSTION, datatypesMap);
    Element testElement = serializableSegment.serialize();
    assertEquals(TEST_EXT, testElement.getAttribute("ext").getValue());
    assertEquals(1, testElement.getChildElements("DynamicMapping").size());
    Element testDynamicMappingElement = testElement.getFirstChildElement("DynamicMapping");
    assertEquals(TEST_DM_REF_PATH, testDynamicMappingElement.getAttribute("referencePath").getValue());
    assertEquals(TEST_DM_VARIES_DT_PATH, testDynamicMappingElement.getAttribute("variesDatatypePath").getValue());
    Elements testDynamicMappingItemsElement = testDynamicMappingElement.getChildElements();
    assertEquals(2, testDynamicMappingItemsElement.size());
    for(int i=0; i<testDynamicMappingItemsElement.size(); i++) {
      Element testDynamicMappingItemElement = testDynamicMappingItemsElement.get(i);
      if(testDynamicMappingItemElement.getAttribute("value").getValue().equals(TEST_DM1_VALUE)) {
        assertEquals(TEST_DM1_DT_NAME, testDynamicMappingItemElement.getAttribute("datatype").getValue());
      } else if(testDynamicMappingItemElement.getAttribute("value").getValue().equals(TEST_DM2_VALUE)) {
        assertEquals(TEST_DM2_DT_NAME, testDynamicMappingItemElement.getAttribute("datatype").getValue());
      } else {
        fail();
      }
    }
    assertEquals(1, testElement.getChildElements("Fields").size());
    Elements testFieldsElements = testElement.getFirstChildElement("Fields").getChildElements();
    assertEquals(2, testFieldsElements.size());
    for(int i=0; i<testFieldsElements.size(); i++) {
      Element testFieldElement = testFieldsElements.get(i);
      if(testFieldElement.getAttribute("id").getValue().equals(TEST_FIELD1_ID)) {
        assertEquals(TEST_FIELD1_NAME, testFieldElement.getAttribute("name").getValue());
        assertEquals(TEST_FIELD1_CONFLENGTH, testFieldElement.getAttribute("confLength").getValue());
        assertEquals(TEST_FIELD1_MAXLENGTH, testFieldElement.getAttribute("maxLength").getValue());
        assertEquals(TEST_FIELD1_MINLENGTH, testFieldElement.getAttribute("minLength").getValue());
        assertEquals(TEST_FIELD1_TEXT, testFieldElement.getAttribute("text").getValue());
        assertEquals(String.valueOf(TEST_FIELD1_MAX), testFieldElement.getAttribute("max").getValue());
        assertEquals(String.valueOf(TEST_FIELD1_MIN), testFieldElement.getAttribute("min").getValue());
        assertEquals(String.valueOf(TEST_FIELD1_POSITION), testFieldElement.getAttribute("position").getValue());
        assertEquals(TEST_FIELD1_DT_NAME, testFieldElement.getAttribute("datatype").getValue());
        assertEquals(String.valueOf(TEST_FIELD1_CUSTOM), testFieldElement.getAttribute("custom").getValue());
        assertEquals(TEST_FIELD1_USAGE.name(), testFieldElement.getAttribute("usage").getValue());
      } else if(testFieldElement.getAttribute("id").getValue().equals(TEST_FIELD2_ID)) {
        assertEquals(TEST_FIELD2_NAME, testFieldElement.getAttribute("name").getValue());
        assertEquals(TEST_FIELD2_CONFLENGTH, testFieldElement.getAttribute("confLength").getValue());
        assertEquals(TEST_FIELD2_MAXLENGTH, testFieldElement.getAttribute("maxLength").getValue());
        assertEquals(TEST_FIELD2_MINLENGTH, testFieldElement.getAttribute("minLength").getValue());
        assertEquals(TEST_FIELD2_TEXT, testFieldElement.getAttribute("text").getValue());
        assertEquals(String.valueOf(TEST_FIELD2_MAX), testFieldElement.getAttribute("max").getValue());
        assertEquals(String.valueOf(TEST_FIELD2_MIN), testFieldElement.getAttribute("min").getValue());
        assertEquals(String.valueOf(TEST_FIELD2_POSITION), testFieldElement.getAttribute("position").getValue());
        assertEquals(TEST_FIELD2_DT_NAME, testFieldElement.getAttribute("datatype").getValue());
        assertEquals(String.valueOf(TEST_FIELD2_CUSTOM), testFieldElement.getAttribute("custom").getValue());
        assertEquals(TEST_FIELD2_USAGE.name(), testFieldElement.getAttribute("usage").getValue());
      } else {
        fail();
      }
    }
    System.out.println(testElement.toXML());
  }
  
  @Test(expected = ResourceSerializationException.class)
  public void testSerializeSegmentDatatypeMissing() throws SerializationException {
    Segment segment = getSegment();
    Map<String,String> datatypesMap = new HashMap<>();
    datatypesMap.put(TEST_DM1_DT_ID, TEST_DM1_DT_NAME);
    datatypesMap.put(TEST_DM2_DT_ID, TEST_DM2_DT_NAME);
    SerializableSegment serializableSegment = new SerializableSegment(segment, TEST_POSTION, datatypesMap);
    try {
      serializableSegment.serialize();
    } catch (ResourceSerializationException e) {
      assertTrue(e.getOriginException() instanceof SubStructElementSerializationException);
      assertTrue(((SubStructElementSerializationException)e.getOriginException()).getOriginException() instanceof DatatypeNotFoundException);
      throw e;
    }
  }
}
