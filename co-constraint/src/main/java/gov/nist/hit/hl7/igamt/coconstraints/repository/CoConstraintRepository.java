package gov.nist.hit.hl7.igamt.coconstraints.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;

@Repository
public interface CoConstraintRepository extends MongoRepository<CoConstraintTable, String> {

	public Optional<CoConstraintTable> findById(String key);

}
