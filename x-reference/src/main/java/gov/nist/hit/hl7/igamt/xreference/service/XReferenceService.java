package gov.nist.hit.hl7.igamt.xreference.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.mongodb.BasicDBObject;

public interface XReferenceService {

  /**
   * 
   * @param datatype
   * @return the references a datatype from a collection of segment ids and datatype ids
   */
  public Map<String, List<BasicDBObject>> getDatatypeReferences(String id, Set<String> datatypeIds,
      Set<String> segmentIds);


}
