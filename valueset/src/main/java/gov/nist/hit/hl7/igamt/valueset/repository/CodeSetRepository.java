package gov.nist.hit.hl7.igamt.valueset.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;

@Repository
public interface CodeSetRepository extends MongoRepository<CodeSet, String> {

}
