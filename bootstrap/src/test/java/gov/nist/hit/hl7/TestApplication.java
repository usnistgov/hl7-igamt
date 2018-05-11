package gov.nist.hit.hl7;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import gov.nist.hit.hl7.igamt.configuration.DataMongoConfig;

// @SpringBootApplication
// @EnableAutoConfiguration(exclude = {BootstrapApplication.class,
// DataSourceAutoConfiguration.class,
// DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
// @EnableMongoRepositories("gov.nist.hit.hl7.igamt")
// @ComponentScan({"gov.nist.hit.hl7.igamt.configuration", "gov.nist.hit.hl7.config",
// "gov.nist.hl7.igamt.shared.authentication", "gov.nist.hit.hl7.auth.util"})


@SpringBootApplication
@EnableAutoConfiguration(
    exclude = {DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@EnableMongoRepositories("gov.nist.hit.hl7.igamt")
@ComponentScan(
    basePackages = {"gov.nist.hit.hl7.igamt.configuration",
        "gov.nist.hl7.igamt.shared.authentication", "gov.nist.hit.hl7.auth.util"},
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE,
            value = BootstrapApplication.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = DataMongoConfig.class)})

public class TestApplication {
  public static void main(String[] args) {
    SpringApplication.run(TestApplication.class, args);
  }
}
