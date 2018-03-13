package gov.nist.hit.hl7.igamt.legacy.config;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import gov.nist.hit.hl7.igamt.legacy.service.impl.AccountConversionServiceImpl;
import gov.nist.hit.hl7.legacy.igamt.jpa.repository.AccountRepository;


@SpringBootApplication

@Configuration
@EnableAutoConfiguration
@ComponentScan({"gov.nist.hit.hl7.igamt.legacy","gov.nist.hit.hl7.legacy.igamt.jpa.repository","gov.nist.hit.hl7.auth" })
@EnableJpaRepositories(basePackageClasses=AccountRepository.class)
@EntityScan("gov.nist.hit.hl7.legacy.igamt.jpa.repository")



public class Application implements CommandLineRunner {
	@Autowired
	private ApplicationContext context;
	
	@Bean
	public ShaPasswordEncoder encoder() {
		return new ShaPasswordEncoder();
	}
	

	
	@Override
	public void run(String... arg0) throws Exception {
		// TODO Auto-generated method stub
		
		   AccountConversionServiceImpl accountService= context.getBean(AccountConversionServiceImpl.class) ;

		   accountService.convert();

	}
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
		
	
	}

}

