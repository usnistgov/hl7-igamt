package gov.nist.hit.hl7.igamt.common.config.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.common.config.domain.Config;

@Repository
public interface ConfigRepository extends MongoRepository<Config, String> {
}
