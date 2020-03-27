///**
// * This software was developed at the National Institute of Standards and Technology by employees of
// * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
// * of the United States Code this software is not subject to copyright protection and is in the
// * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
// * use by other parties, and makes no guarantees, expressed or implied, about its quality,
// * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
// * used. This software can be redistributed and/or modified freely provided that any derivative
// * works bear some notice that they are derived from it, and any modified versions bear some notice
// * that they have been modified.
// */
//package gov.nist.hit.hl7.igamt.xreference.service;
//
//import static org.junit.Assert.assertEquals;
//import static org.junit.Assert.assertNotNull;
//import static org.junit.Assert.assertTrue;
//
//import java.util.Arrays;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//
//import org.hibernate.type.SerializationException;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.context.annotation.Import;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import com.mongodb.BasicDBObject;
//
//import gov.nist.hit.hl7.igamt.xreference.DataMongoConfig;
//import gov.nist.hit.hl7.igamt.xreference.TestApplication;
//
//
//@RunWith(SpringRunner.class)
//@Import(DataMongoConfig.class)
//@SpringBootTest(classes = TestApplication.class)
//public class XRefServiceTest {
//
//  @Autowired
//  XRefService service;
//
//
//
//  /**
//   * Test no filtering Should return the datatypes and segments in the db referencing the datatype
//   * 
//   * @throws SerializationException
//   */
//  // @Test
//  public void testDatatypeXReferencesWithoutContextIds() throws SerializationException {
//    java.util.Map<String, List<BasicDBObject>> references =
//        service.getDatatypeReferences("565f3ab4d4c6e52cfd43845f", null, null);
//    assertTrue(!references.isEmpty());
//  }
//
//  /**
//   * Test filtering and no filtering on actual datatypes and no filtering on segment Should return
//   * referencing datatypes from the list of datatypes filters along with referencing segments from
//   * db
//   * 
//   * @throws SerializationException
//   */
//  // @Test
//  public void testGetDatatypeXReferencesWithDatatypeIdsOnly() throws SerializationException {
//    java.util.Map<String, List<BasicDBObject>> references = service.getDatatypeReferences(
//        "565f3ab4d4c6e52cfd43845f", new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43840d",
//            "565f3ab4d4c6e52cfd438422", "565f3ab4d4c6e52cfd438416")),
//        null);
//    assertTrue(!references.isEmpty());
//    assertTrue(references.keySet().contains(XRefService.DATATYPE));
//    assertTrue(references.get(XRefService.DATATYPE).size() == 2);
//    assertTrue(references.keySet().contains(XRefService.SEGMENT));
//  }
//
//  /**
//   * Testing no filtering on datatypes and filtering on segment Return referencing datatypes from
//   * the db along with referencing segments from of segments filters
//   * 
//   * @throws SerializationException
//   */
//  // @Test
//  public void testGetDatatypeXReferencesWithSegmentIdsOnly() throws Exception {
//    String datatypeId = "565f3ab4d4c6e52cfd43845f";
//    java.util.Map<String, List<BasicDBObject>> references =
//        service.getDatatypeReferences("565f3ab4d4c6e52cfd43845f", new HashSet<String>() {},
//            new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43872d", "565f3ab4d4c6e52cfd438785",
//                "565f3ab4d4c6e52cfd43899c")));
//    assertTrue(!references.isEmpty());
//    assertTrue(references.keySet().contains(XRefService.SEGMENT));
//    assertTrue(references.get(XRefService.SEGMENT).size() == 2);
//    assertTrue(!references.keySet().contains(XRefService.DATATYPE));
//
//  }
//
//  /**
//   * Testing filtering on datatypes and filtering on segment. Return referencing datatypes from
//   * datatypes filters along with referencing segments from segments filters
//   * 
//   * @throws SerializationException
//   */
//  // @Test
//  public void testGetDatatypeXReferencesWithSegmentIdAndDatatypeIds() throws Exception {
//    java.util.Map<String, List<BasicDBObject>> references =
//        service.getDatatypeReferences("565f3ab4d4c6e52cfd43845f",
//            new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43840d", "565f3ab4d4c6e52cfd438422",
//                "565f3ab4d4c6e52cfd438416")),
//            new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43872d", "565f3ab4d4c6e52cfd438785",
//                "565f3ab4d4c6e52cfd43899c")));
//    assertTrue(!references.isEmpty());
//    assertTrue(references.keySet().contains(XRefService.SEGMENT));
//    assertTrue(references.get(XRefService.SEGMENT).size() == 2);
//    assertTrue(references.keySet().contains(XRefService.DATATYPE));
//    assertTrue(references.get(XRefService.DATATYPE).size() == 2);
//  }
//
//  /**
//   * Testing filtering on conformance profiles. The conformance profile provided does not exist.
//   * Return empty list of references
//   * 
//   * @throws SerializationException
//   */
//  //// @Test
//  public void testGetSegmentReferencesWithUnknownConformanceProfiles() throws Exception {
//    java.util.Map<String, List<BasicDBObject>> references = service.getSegmentReferences(
//        "565f3ab4d4c6e52cfd438b5b", new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd438b5b")));
//    assertTrue(references.isEmpty());
//  }
//
//
//
//  /**
//   * Testing filtering on conformance profiles. Return referencing conformance profiles from
//   * conformance profiles filtering list. Segment is referenced by direct child segmentRef of the
//   * conformance profile
//   * 
//   * @throws SerializationException
//   */
//  // @Test
//  public void testGetSegmentReferencesWithValidConformanceProfiles() throws Exception {
//    String segmentId = "565f3ab4d4c6e52cfd438893";
//    Set<String> filterConformanceProfiles =
//        new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd439066"));
//    java.util.Map<String, List<BasicDBObject>> references =
//        service.getSegmentReferences(segmentId, filterConformanceProfiles);
//    assertTrue(!references.isEmpty());
//    assertTrue(references.keySet().contains(XRefService.CONFORMANCE_PROFILE));
//    assertTrue(references.get(XRefService.CONFORMANCE_PROFILE).size() == 1);
//    List<BasicDBObject> conformanceProfiles = references.get(XRefService.CONFORMANCE_PROFILE);
//    BasicDBObject conformanceProfile = conformanceProfiles.get(0);
//    List<BasicDBObject> segmentRefs = (List<BasicDBObject>) conformanceProfile.get("children");
//    assertEquals(4, segmentRefs.size());
//    for (int i = 0; i < segmentRefs.size(); i++) {
//      BasicDBObject segmentRef = segmentRefs.get(i);
//      assertNotNull(segmentRef.get("path").toString(), "Path cannot be null");
//    }
//
//  }
//
//
//  /**
//   * Testing filtering on conformance profiles. Return referencing conformance profiles from
//   * conformance profiles filtering list. Segment is referenced by first group's segmentRef of the
//   * conformance profile
//   * 
//   * @throws SerializationException
//   */
//  // @Test
//  public void testGetSegmentReferencesWithValidConformanceProfiles2() throws Exception {
//    String segmentId = "565f3ab4d4c6e52cfd438c4c";
//    Set<String> filterConformanceProfiles =
//        new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43912a"));
//    Map<String, List<BasicDBObject>> references =
//        service.getSegmentReferences(segmentId, filterConformanceProfiles);
//    assertTrue(!references.isEmpty());
//    assertTrue(references.keySet().contains(XRefService.CONFORMANCE_PROFILE));
//    assertTrue(references.get(XRefService.CONFORMANCE_PROFILE).size() == 1);
//    List<BasicDBObject> segmentRefs = (List<BasicDBObject>) references
//        .get(XRefService.CONFORMANCE_PROFILE).get(0).get("children");
//    assertEquals(4, segmentRefs.size());
//    assertEquals(4, segmentRefs.size());
//    for (int i = 0; i < segmentRefs.size(); i++) {
//      BasicDBObject segmentRef = segmentRefs.get(i);
//      assertNotNull(segmentRef.get("path").toString(), "Path cannot be null");
//    }
//  }
//
//  @Test
//  public void testGetValuesetReferencesBySegment() throws Exception {
//    java.util.Map<String, List<BasicDBObject>> references =
//        service.getValueSetReferences("565f3ab4d4c6e52cfd437b91", new HashSet<String>() {},
//            new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd438638")));
//    assertTrue(!references.isEmpty());
//    assertTrue(references.keySet().contains(XRefService.SEGMENT));
//    assertTrue(references.get(XRefService.SEGMENT).size() == 1);
//  }
//
//}
