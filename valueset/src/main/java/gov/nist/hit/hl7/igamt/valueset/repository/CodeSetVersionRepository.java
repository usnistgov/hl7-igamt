package gov.nist.hit.hl7.igamt.valueset.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;

@Repository
public interface CodeSetVersionRepository extends MongoRepository<CodeSetVersion, String> {

}

