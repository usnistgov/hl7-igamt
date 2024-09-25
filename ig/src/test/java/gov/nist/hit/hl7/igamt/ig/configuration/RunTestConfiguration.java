package gov.nist.hit.hl7.igamt.ig.configuration;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@ComponentScan({"gov.nist.hit.hl7", "gov.nist.hit.hl7.auth.util.crypto","gov.nist.hit.hl7.auth.util.service"})
@EnableAutoConfiguration(exclude = {
		EmbeddedMongoAutoConfiguration.class,
		DataSourceAutoConfiguration.class,
		DataSourceTransactionManagerAutoConfiguration.class,
		HibernateJpaAutoConfiguration.class
})
@EnableMongoRepositories("gov.nist.hit.hl7")
public class RunTestConfiguration {

	@Bean
	MongoClient mongoClient(EmbeddedMongoDB instance) {
		return new MongoClient(new ServerAddress("localhost", instance.getPort()));
	}

	@Bean
	MongoOperations mongoTemplate(MongoClient mongoClient) {
		return new MongoTemplate(mongoClient, "hl7-igamt-test");
	}

	@Bean()
	public FhirContext fhirR4Context() {
		return FhirContext.forR4();
	}
}
