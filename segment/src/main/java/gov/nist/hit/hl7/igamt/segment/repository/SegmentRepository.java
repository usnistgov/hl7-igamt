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
package gov.nist.hit.hl7.igamt.segment.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */
public interface SegmentRepository extends MongoRepository<Segment, CompositeKey> {
  List<Segment> findByDomainInfoVersion(String version);

  List<Segment> findByDomainInfoScope(String scope);

  List<Segment> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  List<Segment> findByName(String name);

  List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version,
      String name);

  List<Segment> findByDomainInfoVersionAndName(String version, String name);

  List<Segment> findByDomainInfoScopeAndName(String scope, String name);

  @Query(value = "{ '_id._id' : ?0 }")
  List<Segment> findLatestById(ObjectId id, Sort sort);


}
