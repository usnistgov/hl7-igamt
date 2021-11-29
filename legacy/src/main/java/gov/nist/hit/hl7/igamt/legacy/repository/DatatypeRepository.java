package gov.nist.hit.hl7.igamt.legacy.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;

@Repository("datatypeRepository")
public interface DatatypeRepository extends MongoRepository<Datatype, String> {
  @Query(value = "{ '_id' : ?0 }", fields= "{name : 1,scope:1,hl7Version:1,_id:1,ext:1}")
  Datatype findDisplayObject(String id );
}
