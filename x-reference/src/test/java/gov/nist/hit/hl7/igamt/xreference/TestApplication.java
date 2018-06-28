package gov.nist.hit.hl7.igamt.xreference;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableAutoConfiguration(
    exclude = {DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@EnableMongoRepositories("gov.nist.hit.hl7.igamt")
@ComponentScan(basePackages = {"gov.nist.hit.hl7.igamt.configuration",
    "gov.nist.hl7.igamt.shared.authentication", "gov.nist.hit.hl7.auth.util"})

public class TestApplication {
  // public static void main(String[] args) {
  // SpringApplication.run(TestApplication.class, args);
  // }
}
