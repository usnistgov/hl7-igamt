package gov.nist.hit.hl7.auth.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.domain.Privilege;
import gov.nist.hit.hl7.auth.repository.AccountRepository;
import gov.nist.hit.hl7.auth.repository.PrivilegeRepository;
import gov.nist.hit.hl7.auth.service.AccountService;

@Service("accountServiceMongo")
public class AccountServiceImpl implements AccountService {

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private PrivilegeRepository privilegeRepository;
	

	@Autowired
	private ShaPasswordEncoder encoder;

	@Override
	public Account getAccountByUsername(String username) {
		return accountRepository.findByUsername(username);
	}

	@Override
	public Account createAdmin(Account account) {
		
		if (!account.getUsername().isEmpty() && !account.getPassword().isEmpty()) {
			account.setPassword(encoder.encodePassword(account.getPassword(),account.getUsername()));
			Set<Privilege> roles = new HashSet<Privilege>(privilegeRepository.findAll());
			account.setPrivileges(roles);
			accountRepository.save(account);
			return account;
		}
		return null;
	}

	@Override
	public Account createNoramlUser(Account account) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		if (!account.getUsername().isEmpty()
				&& !account.getPassword().isEmpty()) {
			account.setPassword(encoder.encode(account.getPassword()));
			Set<Privilege> roles = new HashSet<Privilege>();
			roles.add(privilegeRepository.findByRole("USER"));
			account.setPrivileges(roles);
			accountRepository.save(account);
			return account;
		}
		return null;
	}

	@Override
	public void deleteAll() {

		accountRepository.deleteAll();
	}

	@Override
	public Account getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof Account)) {
			return null;
		}
		return (Account) authentication.getPrincipal();
	}

	@Override
	public Account createUser(Account account, Privilege p) {
		if(p.getRole().equals("ADMIN")){
			this.createAdmin(account);
		}
		else {
			this.createNoramlUser(account);
		}
		return null;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Account a = this.getAccountByUsername(username);
		if(a != null){
			return a.userDetails();
		}
		else {
			throw new UsernameNotFoundException(username);
		}
	}

	@Override
	public Privilege getPrivilegeByRole(String role) {
		return this.privilegeRepository.findByRole(role);
	}
	
	@Override
	public Privilege createPrivilegeByRole(String role) {
		Privilege p = new Privilege(role);
		if(this.privilegeRepository.findByRole(role) == null){
			this.privilegeRepository.save(p);
			return p;
		}
		return this.privilegeRepository.findByRole(role);
	}

	@Override
	public List<Account> findAll() {
		return accountRepository.findAll();
		// TODO Auto-generated method stub
	}


	@Override
	public boolean emailExist(String email) {

	       Account user = accountRepository.findByEmail(email);
	        if (user != null) {
	            return true;
	        }
	        return false;
	}

	@Override
	public boolean userNameExist(String username) {
		// TODO Auto-generated method stub
	       Account user = accountRepository.findByUsername(username);
	        if (user != null) {
	            return true;
	        }
	        return false;
	}

}