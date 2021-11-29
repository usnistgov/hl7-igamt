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
package gov.nist.hit.hl7.igamt.datatype.repository;

import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.common.base.domain.ActiveStatus;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

/**
 *
 * @author Maxence Lefort on Mar 1, 2018.
 */
@Repository
public interface DatatypeRepository extends MongoRepository<Datatype, String> {

  List<Datatype> findByDomainInfoVersion(String version);



  List<Datatype> findByDomainInfoScope(String scope);

  List<Datatype> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  List<Datatype> findByName(String name);

  List<Datatype> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version,
      String name);

  List<Datatype> findByDomainInfoVersionAndName(String version, String name);

  List<Datatype> findByDomainInfoScopeAndName(String scope, String name);

  @Query(value = "{ 'domainInfo.scope' : ?0 }")
  List<Datatype> findByScope(Scope scope);
  List<Datatype> findByIdIn(Set<String> ids);
  List<Datatype> findByParentId(String id);
  List<Datatype> findByDomainInfoCompatibilityVersionContainsAndDomainInfoScopeAndActiveInfoStatus(String version, Scope scope, ActiveStatus status);
  
  List<Datatype> findByDerived(boolean derived);
  public Datatype findOneById(String key);
  public boolean existsByNameAndDomainInfoScopeAndDomainInfoVersion(String name, Scope scope, String version);

}
