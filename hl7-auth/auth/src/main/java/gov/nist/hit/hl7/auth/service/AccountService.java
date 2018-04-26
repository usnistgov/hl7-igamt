package gov.nist.hit.hl7.auth.service;


import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.auth.converter.OldAccount;
import gov.nist.hit.hl7.auth.converter.OldUser;
import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.domain.Privilege;
@Service
public interface AccountService extends UserDetailsService {

	public Account getCurrentUser();
	public Account getAccountByUsername(String username);
	public Account createAdmin(Account account);
	public Account createNoramlUser(Account account);
	public Account createUser(Account account,Privilege p);
	public Privilege getPrivilegeByRole(String role);
	public Privilege createPrivilegeByRole(String role);
	public List<Account> findAll();
	public void deleteAll();
	boolean emailExist(String email) ;
	boolean userNameExist(String username) ;
	void createAccountsFromLegacy() throws IOException;
	public Account findByAccountId(Long accountID);
	
}