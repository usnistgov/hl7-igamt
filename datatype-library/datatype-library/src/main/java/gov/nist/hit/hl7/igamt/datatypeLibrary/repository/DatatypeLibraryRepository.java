package gov.nist.hit.hl7.igamt.datatypeLibrary.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;



@Repository("DatatypeLibraryRepository")
public interface DatatypeLibraryRepository extends MongoRepository<DatatypeLibrary, CompositeKey> {

  @Query(value = "{ '_id._id' : ?0 }")
  List<DatatypeLibrary> findByUsername(String username);

  List<DatatypeLibrary> findByIdId(String id);

  List<DatatypeLibrary> findByIdVersion(int version);

  @Query(value = "{ '_id._id' : ?0 }")
  List<DatatypeLibrary> findLatestById(ObjectId id, Sort sort);

  List<DatatypeLibrary> findByDomainInfoScope(String scope);

  @Query(value = "{ 'username' : ?0 }", fields = "{_id : 1}")
  List<DatatypeLibrary> findDatatypeLibraryIdsForUser(String username);

}
