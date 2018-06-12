package gov.nist.hit.hl7.igamt.xreference.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.xreference.DataMongoConfig;
import gov.nist.hit.hl7.igamt.xreference.TestApplication;


@RunWith(SpringRunner.class)
@Import(DataMongoConfig.class)
@SpringBootTest(classes = TestApplication.class)
public class XReferenceServiceTest {

  XReferenceService service;


  @Test
  public void testDatatypeXReferences() throws SerializationException {



  }
}
