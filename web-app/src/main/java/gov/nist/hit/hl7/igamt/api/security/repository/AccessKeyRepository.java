package gov.nist.hit.hl7.igamt.api.security.repository;

import gov.nist.hit.hl7.igamt.api.security.domain.AccessKey;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessKeyRepository extends MongoRepository<AccessKey, String> {
	AccessKey findByToken(String token);
}
