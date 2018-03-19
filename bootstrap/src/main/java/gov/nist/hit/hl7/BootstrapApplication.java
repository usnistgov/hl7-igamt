package gov.nist.hit.hl7;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.domain.Privilege;
import gov.nist.hit.hl7.auth.repository.PrivilegeRepository;
import gov.nist.hit.hl7.auth.service.AccountService;

@SpringBootApplication
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})

public class BootstrapApplication implements CommandLineRunner {
	
	@Autowired
	AccountService accountService;
	@Autowired
	PrivilegeRepository priviliges;
	
	public static void main(String[] args) {
		SpringApplication.run(BootstrapApplication.class, args);
		
	
	}

	@Bean
	public ShaPasswordEncoder encoder() {
		return new ShaPasswordEncoder(256);
	}

	@Override
	public void run(String... arg0) throws Exception {
		// TODO Auto-generated method stub
//		Account acc = new Account();
//		acc.setUsername("test");
//		acc.setPassword("123");
//		accountService.createAdmin(acc);

		
		
	}
	@PostConstruct
	void  converAccounts() {
//		try {
//			Privilege user= 	new Privilege("USER");
//			Privilege admin = 	new Privilege("ADMIN");
//			
//			priviliges.save(user);
//			priviliges.save(admin);
//			
//			accountService.createAccountsFromLegacy();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
	}
}
