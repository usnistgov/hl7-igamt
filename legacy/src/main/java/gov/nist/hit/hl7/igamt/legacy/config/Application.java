package gov.nist.hit.hl7.igamt.legacy.config;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

import gov.nist.hit.hl7.auth.service.AccountService;



@SpringBootApplication

@Configuration
//@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@ComponentScan({"gov.nist.hit.hl7.igamt.legacy","gov.nist.hit.hl7.legacy.igamt.jpa.repository","gov.nist.hit.hl7.auth" })

public class Application implements CommandLineRunner {
	@Autowired
	AccountService a ; 
	@Bean
	public ShaPasswordEncoder encoder() {
		return new ShaPasswordEncoder(256);
	}
	
	@Override
	public void run(String... arg0) throws Exception {


	}
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
		
	
	}

}

