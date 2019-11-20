//package gov.nist.hit.hl7.igamt.segment.service;
//
//import java.io.ByteArrayOutputStream;
//import java.io.OutputStream;
//import java.util.Map;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
////import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;
//
//public interface CoConstraintService {
//
//  public CoConstraintTable getCoConstraintForSegment(String id);
//
//  public CoConstraintTable clone(Map<String, String> valueSets,Map<String, String> datatypes,
//      String segmentId, CoConstraintTable cc);
//
//  public Map<String, String> references(CoConstraintTable cc);
//
////  public CoConstraintTable saveCoConstraintForSegment(String id, CoConstraintTable cc, String user)
////      throws CoConstraintSaveException;
//
//  public ByteArrayOutputStream exportToExcel(String id);
//
//}
