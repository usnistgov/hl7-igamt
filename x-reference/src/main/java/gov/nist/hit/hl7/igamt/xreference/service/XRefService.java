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

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.mongodb.BasicDBObject;

/**
 * 
 * @author Harold Affo
 *
 */
public abstract class XRefService {

  public static final String DATATYPE = "DATATYPE";
  public static final String SEGMENT = "SEGMENT";
  public static final String PROFILE_COMPONENT = "PROFILE_COMPONENT";
  public static final String CONFORMANCE_PROFILE = "CONFORMANCE_PROFILE";
  public static final String COMPOSITE_PROFILE = "COMPOSITE_PROFILE";



  /**
   * 
   * @param datatype
   * @return the references a datatype from a collection of segment ids and datatype ids
   */
  public abstract Map<String, List<BasicDBObject>> getDatatypeReferences(String id,
      Set<String> datatypeIds, Set<String> segmentIds);

  /**
   * 
   * @param id
   * @param conformanceProfileIds
   * @return the references a segment from a collection of conformance profile ids
   */
  public abstract Map<String, List<BasicDBObject>> getSegmentReferences(String id,
      Set<String> conformanceProfileIds);


}
