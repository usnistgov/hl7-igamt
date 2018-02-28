package gov.nist.hit.hl7.auth.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import gov.nist.hit.hl7.auth.domain.Privilege;


public interface PrivilegeRepository extends MongoRepository<Privilege, String> {
	
	public Privilege findByRole(String role);
}