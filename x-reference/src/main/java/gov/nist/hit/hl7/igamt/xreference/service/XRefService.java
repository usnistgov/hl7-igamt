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

import org.bson.Document;

import gov.nist.hit.hl7.igamt.xreference.exceptions.XReferenceException;

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
   * @param id: id of the datatype
   * @param filterDatatypeIds: filter list of datatypes ids. If null, no filtering which means all
   *        datatypes referencing the datatype will be returned
   * @param filterSegmentIds:filter list of segment ids. If null, no filtering which means all
   *        segments referencing the datatype will be returned
   * @return
   */
  public abstract Map<String, List<Document>> getDatatypeReferences(String id,
      Set<String> filterDatatypeIds, Set<String> filterSegmentIds);

  /**
   * 
   * @param id: if of the segment
   * @param filterConformanceProfileIds: filter list of conformance profile Ids. If null, no
   *        filtering which means all conformance profiles referencing the segment will be returned
   * @return the references a segment from a collection of conformance profile ids
   */
  public abstract Map<String, List<Document>> getSegmentReferences(String id,
      Set<String> filterConformanceProfileIds);

  /**
   * 
   * @param id: id of the value set
   * @param filterDatatypeIds: filter list of datatypes ids. If null, no filtering which means all
   *        datatypes referencing the valueset will be returned
   * @param filterSegmentIds:filter list of segment ids. If null, no filtering which means all
   *        segments referencing the valueset will be returned
   * @return
   * @throws XReferenceException
   */
  public abstract Map<String, List<Document>> getValueSetReferences(String id,
      Set<String> datatypeIds, Set<String> segmentIds, Set<String> conformanceProfiles)
      throws XReferenceException;

  /**
   * @param datatypeId
   * @param filterDatatypeIds
   * @return
   */
  public abstract Map<String, List<Document>> getDatatypeReferences(String datatypeId,
      Set<String> filterDatatypeIds);


}
