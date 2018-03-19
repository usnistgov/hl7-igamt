package gov.nist.hit.hl7.auth.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.auth.domain.Privilege;

@Repository

public interface PrivilegeRepository extends MongoRepository<Privilege, String> {
	
	public Privilege findByRole(String role);
}