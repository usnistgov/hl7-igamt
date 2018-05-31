package gov.nist.hit.hl7.igamt.ig.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

@Repository("igRepository")
public interface IgRepository extends MongoRepository<Ig, CompositeKey> {

  @Query(value = "{ '_id._id' : ?0 }")

  List<Ig> findByUsername(String username);

  List<Ig> findByIdId(String id);

  List<Ig> findByIdVersion(int version);

  // @Query(value = "{ '_id._id' : ?0 }")
  // Page<Ig> findLatestById(Pageable pageable);
  @Query(value = "{ '_id._id' : ?0 }")
  List<Ig> findLatestById(ObjectId id, Sort sort);

  List<Ig> findByDomainInfoScope(String scope);

  @Query(value = "{ 'username' : ?0 }", fields = "{_id : 1}")
  List<Ig> findIgIdsForUser(String username);

}
