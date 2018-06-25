/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.xreference.service;

import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import org.hibernate.type.SerializationException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import com.mongodb.BasicDBObject;

import gov.nist.hit.hl7.igamt.xreference.DataMongoConfig;
import gov.nist.hit.hl7.igamt.xreference.TestApplication;


@RunWith(SpringRunner.class)
@Import(DataMongoConfig.class)
@SpringBootTest(classes = TestApplication.class)
public class XRefServiceTest {

  @Autowired
  XRefService service;



  @Test
  public void testDatatypeXReferencesWithoutContextIds() throws SerializationException {
    java.util.Map<String, List<BasicDBObject>> references =
        service.getDatatypeReferences("565f3ab4d4c6e52cfd43845f", null, null);
    assertTrue(references.isEmpty());
  }

  @Test
  public void testGetDatatypeXReferencesWithDatatypeIdsOnly() throws SerializationException {
    java.util.Map<String, List<BasicDBObject>> references = service.getDatatypeReferences(
        "565f3ab4d4c6e52cfd43845f", new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43840d",
            "565f3ab4d4c6e52cfd438422", "565f3ab4d4c6e52cfd438416")),
        null);
    assertTrue(!references.isEmpty());
    assertTrue(references.keySet().contains(XRefService.DATATYPE));
    assertTrue(references.get(XRefService.DATATYPE).size() == 2);
    assertTrue(!references.keySet().contains(XRefService.SEGMENT));
  }

  @Test
  public void testGetDatatypeXReferencesWithSegmentIdsOnly() throws Exception {
    java.util.Map<String, List<BasicDBObject>> references = service.getDatatypeReferences(
        "565f3ab4d4c6e52cfd43845f", null, new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43872d",
            "565f3ab4d4c6e52cfd438785", "565f3ab4d4c6e52cfd43899c")));
    assertTrue(!references.isEmpty());
    assertTrue(references.keySet().contains(XRefService.SEGMENT));
    assertTrue(references.get(XRefService.SEGMENT).size() == 2);
    assertTrue(!references.keySet().contains(XRefService.DATATYPE));
  }

  @Test
  public void testGetDatatypeXReferencesWithSegmentIdAndDatatypeIds() throws Exception {
    java.util.Map<String, List<BasicDBObject>> references =
        service.getDatatypeReferences("565f3ab4d4c6e52cfd43845f",
            new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43840d", "565f3ab4d4c6e52cfd438422",
                "565f3ab4d4c6e52cfd438416")),
            new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd43872d", "565f3ab4d4c6e52cfd438785",
                "565f3ab4d4c6e52cfd43899c")));
    assertTrue(!references.isEmpty());
    assertTrue(references.keySet().contains(XRefService.SEGMENT));
    assertTrue(references.get(XRefService.SEGMENT).size() == 2);
    assertTrue(references.keySet().contains(XRefService.DATATYPE));
    assertTrue(references.get(XRefService.DATATYPE).size() == 2);
  }

  @Test
  public void testGetSegmentReferencesWithUnknownConformanceProfiles() throws Exception {
    java.util.Map<String, List<BasicDBObject>> references = service.getSegmentReferences(
        "565f3ab4d4c6e52cfd438b5b", new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd438b5b")));
    assertTrue(references.isEmpty());
  }



  /**
   * OBX segment (565f3ab4d4c6e52cfd438f0e) is referenced by direct segment ref, group's segment,
   * group's group's segmentRef
   * 
   * @throws Exception
   */
  @Test
  public void testGetSegmentReferencesWithValidConformanceProfiles() throws Exception {
    java.util.Map<String, List<BasicDBObject>> references =
        service.getSegmentReferences("565f3ab4d4c6e52cfd438f0e",
            new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd439cc2", "565f3ab4d4c6e52cfd439716")));
    assertTrue(!references.isEmpty());
    assertTrue(references.keySet().contains(XRefService.CONFORMANCE_PROFILE));
    assertTrue(references.get(XRefService.CONFORMANCE_PROFILE).size() == 1);
  }
}
