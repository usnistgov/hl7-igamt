package gov.nist.hit.hl7.igamt.shared.config;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface SharedConstantRepository extends MongoRepository<SharedConstant, String> {
	
	
	

}
