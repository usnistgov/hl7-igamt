package gov.nist.hit.hl7.igamt.common.config.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.common.config.domain.UserConfig;

@Repository
public interface UserConfigRepository extends MongoRepository<UserConfig, String> {
	
	List<UserConfig> findByUsername(String username);
}

