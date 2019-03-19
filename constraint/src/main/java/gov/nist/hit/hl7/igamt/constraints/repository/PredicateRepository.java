package gov.nist.hit.hl7.igamt.constraints.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.constraints.domain.Level;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;

@Repository
public interface PredicateRepository extends MongoRepository<Predicate, String> {

	public Optional<Predicate> findById(String key);
	
	public Set<Predicate> findByIgDocumentId(String igDocumentId);
	
	public Set<Predicate> findByIgDocumentIdAndLevel(String igDocumentId, Level level);

}
