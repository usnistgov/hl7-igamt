package gov.nist.hit.hl7;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.DispatcherServletAutoConfiguration;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.DispatcherServlet;

import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.service.AccountService;
import gov.nist.hit.hl7.auth.service.impl.AccountServiceImpl;

@SpringBootApplication
public class BootstrapApplication implements CommandLineRunner {
	
	@Autowired
	AccountService accountService;
	
	public static void main(String[] args) {
		SpringApplication.run(BootstrapApplication.class, args);
		
	
	}

	@Bean
	public BCryptPasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	public void run(String... arg0) throws Exception {
		// TODO Auto-generated method stub
		Account acc = new Account();
		acc.setUsername("ABDEL");
		acc.setPassword("123");
		accountService.createAdmin(acc);
		
		
	}
}
