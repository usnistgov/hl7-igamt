package gov.nist.hit.hl7.igamt.ig.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
@Repository("igRepository")
public interface IgRepository extends MongoRepository<Ig, CompositeKey> {
	
	
	List<Ig> findByUsername(String username);
		

}
