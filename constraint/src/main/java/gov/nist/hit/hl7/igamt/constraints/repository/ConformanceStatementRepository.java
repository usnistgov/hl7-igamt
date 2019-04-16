package gov.nist.hit.hl7.igamt.constraints.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;

@Repository
public interface ConformanceStatementRepository extends MongoRepository<ConformanceStatement, String> {

	public Optional<ConformanceStatement> findById(String key);
	
	public Set<ConformanceStatement> findByIgDocumentIdAndStructureId(String igDocumentId, String structureId);
	
	public Set<ConformanceStatement> findByIgDocumentId(String igDocumentId);

}
