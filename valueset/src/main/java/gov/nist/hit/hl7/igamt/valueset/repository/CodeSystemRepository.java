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
package gov.nist.hit.hl7.igamt.valueset.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSystem;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */

@Repository
public interface CodeSystemRepository extends MongoRepository<CodeSystem, CompositeKey> {

  List<CodeSystem> findByIdentifier(String identifier);

  @Override
  public Optional<CodeSystem> findById(CompositeKey id);

  List<CodeSystem> findByDomainInfoScopeAndDomainInfoVersionAndIdentifier(String scope,
      String hl7version, String identifier);

  List<CodeSystem> findByDomainInfoVersion(String version);

  List<CodeSystem> findByDomainInfoScope(String scope);

  List<CodeSystem> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  @Query(value = "{ '_id._id' : ?0 }")
  List<CodeSystem> findLatestById(ObjectId id, Sort sort);
}
