package gov.nist.hit.hl7.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

import gov.nist.hit.hl7.auth.repository.PrivilegeRepository;
import gov.nist.hit.hl7.auth.service.AccountService;


@SpringBootApplication
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class,
    DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@EnableMongoRepositories("gov.nist.hit.hl7")
@ComponentScan({"gov.nist.hit.hl7"})
public class App implements CommandLineRunner {

  @Autowired
  PrivilegeRepository priviliges;

  @Autowired
  AccountService accountService;


  public static void main(String[] args) {
    SpringApplication.run(App.class, args);

  }

  @Bean
  public EmbeddedServletContainerCustomizer containerCustomizer() {
    return (container -> {
      container.setPort(8090);
    });
  }

  @Bean
  public ShaPasswordEncoder encoder() {
    return new ShaPasswordEncoder(256);
  }

  @Override
  public void run(String... arg0) throws Exception {

  }
  // @PostConstruct
  // void converAccounts() {
  // try {
  // Privilege user= new Privilege("USER");
  // Privilege admin = new Privilege("ADMIN");
  //
  // priviliges.save(user);
  // priviliges.save(admin);
  // accountService.createAccountsFromLegacy();
  // } catch (IOException e) {
  // // TODO Auto-generated catch block
  // e.printStackTrace();
  // }
  //
  // }
}
