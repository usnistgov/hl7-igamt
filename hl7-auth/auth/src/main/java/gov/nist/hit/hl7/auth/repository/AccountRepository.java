package gov.nist.hit.hl7.auth.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.auth.domain.Account;


@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
	
	public Account findByUsername(String username);
	public Account findByEmail(String email);
	public Account findByAccountId(Long accountId);
	
}