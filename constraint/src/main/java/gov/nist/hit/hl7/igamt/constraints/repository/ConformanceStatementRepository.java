package gov.nist.hit.hl7.igamt.constraints.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;

@Repository
public interface ConformanceStatementRepository extends MongoRepository<ConformanceStatement, String> {

	public Optional<ConformanceStatement> findById(String key);

}
