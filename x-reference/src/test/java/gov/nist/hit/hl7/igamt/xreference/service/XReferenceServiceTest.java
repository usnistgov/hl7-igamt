package gov.nist.hit.hl7.igamt.xreference.service;

import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import com.mongodb.BasicDBObject;

import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.xreference.DataMongoConfig;
import gov.nist.hit.hl7.igamt.xreference.TestApplication;


@RunWith(SpringRunner.class)
@Import(DataMongoConfig.class)
@SpringBootTest(classes = TestApplication.class)
public class XReferenceServiceTest {

  @Autowired
  XReferenceService service;



  @Test
  public void testDatatypeXReferencesWithoutContextIds() throws SerializationException {
    java.util.Map<String, List<BasicDBObject>> references = service.getDatatypeReferences(
        "565f3ab4d4c6e52cfd43845f", new HashSet<String>() {}, new HashSet<String>() {});
    assertTrue(references.isEmpty());
  }

  @Test
  public void testDatatypeXReferencesWithDatatypesIdsOnly() throws SerializationException {
    java.util.Map<String, List<BasicDBObject>> references =
        service.getDatatypeReferences("565f3ab4d4c6e52cfd43845f",
            new HashSet<>(Arrays.asList("565f3ab4d4c6e52cfd438785", "565f3ab4d4c6e52cfd438422")),
            new HashSet<String>() {});
    assertTrue(!references.isEmpty());
    assertTrue(references.keySet().contains("DATATYPE"));
    assertTrue(!references.get("DATATYPE").isEmpty());
    assertTrue(!references.keySet().contains("SEGMENT"));
    assertTrue(references.get("SEGMENT").isEmpty());
  }



}
