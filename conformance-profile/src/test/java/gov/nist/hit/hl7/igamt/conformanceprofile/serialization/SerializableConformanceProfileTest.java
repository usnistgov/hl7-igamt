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
package gov.nist.hit.hl7.igamt.conformanceprofile.serialization;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.junit.Test;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Group;
import gov.nist.hit.hl7.igamt.shared.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.shared.domain.Usage;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 28, 2018.
 */
public class SerializableConformanceProfileTest {
  
  private final static String TEST_ID = "test_id";
  private final static String TEST_NAME = "test_name";
  private final static String TEST_IDENTIFIER = "test_identifier";
  private final static String TEST_MESSAGETYPE = "test_messageType";
  private final static String TEST_EVENT = "test_event";
  private final static String TEST_STRUCTID = "test_structID";
  //String id, String name, int position, Usage usage, String text, boolean custom,int min, String max, Ref ref)
  private final static SegmentRef TEST_SEGMENT_REF1 = new SegmentRef("test_segmentref1_id","test_segmentref1_name",1,Usage.O,"test_segmentref1_text",false,14,"test_segmentref1_max",new Ref("test_segmentref1_ref"));
  private final static SegmentRef TEST_SEGMENT_REF2 = new SegmentRef("test_segmentref2_id","test_segmentref2_name",2,Usage.O,"test_segmentref2_text",false,76,"test_segmentref2_max",new Ref("test_segmentref2_ref"));
  private final static Set<MsgStructElement> TEST_GROUP_CHILDREN = new HashSet<>(Arrays.asList(TEST_SEGMENT_REF1,TEST_SEGMENT_REF2));
  private final static Group TEST_GROUP = new Group("test_group_id","test_group_name",
      3,Usage.R,"test_group_text",false,1,"test_group_max",TEST_GROUP_CHILDREN,null);
  private final static Set<MsgStructElement> TEST_CP_STRUCTURE = new HashSet<>(Arrays.asList(TEST_GROUP,TEST_SEGMENT_REF1,TEST_SEGMENT_REF2));
  
  private ConformanceProfile getTestConformanceProfile() {
    ConformanceProfile conformanceProfile = new ConformanceProfile();
    conformanceProfile.setId(new CompositeKey(TEST_ID));
    conformanceProfile.setName(TEST_NAME);
    conformanceProfile.setIdentifier(TEST_IDENTIFIER);
    conformanceProfile.setMessageType(TEST_MESSAGETYPE);
    conformanceProfile.setEvent(TEST_EVENT);
    conformanceProfile.setStructID(TEST_STRUCTID);
    conformanceProfile.setChildren(TEST_CP_STRUCTURE);
    return conformanceProfile;
  }
  
  @Test
  public void testSerializeConformanceProfile() throws ResourceSerializationException {
    ConformanceProfile conformanceProfile = this.getTestConformanceProfile();
    Map<String, String> datatypeMap = new HashMap<>();
    datatypeMap.put("test_segmentref1_ref", "test_segmentref1_datatype");
    datatypeMap.put("test_segmentref2_ref", "test_segmentref2_datatype");
    SerializableConformanceProfile serializableConformanceProfile = new SerializableConformanceProfile(conformanceProfile, "1", datatypeMap);
    Element conformanceProfileElement = serializableConformanceProfile.serialize();
    System.out.println(conformanceProfileElement.toXML());
  }
}
