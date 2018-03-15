package gov.nist.hit.hl7.igamt.legacy.service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;

@Configuration
@ComponentScan({"gov.nist.hit.hl7.igamt"})
@EnableMongoRepositories({"gov.nist.hit.hl7.igamt.segment", "gov.nist.hit.hl7.igamt.datatype",
    "gov.nist.hit.hl7.igamt.valueset", "gov.nist.hit.hl7.igamt.conformanceprofile",
    "gov.nist.hit.hl7.igamt.compositeprofile", "gov.nist.hit.hl7.igamt.profilecomponent"})
public class ApplicationConfig {

  @Bean
  public MongoDbFactory mongoDbFactory() throws Exception {

    MongoClient mongoClient = new MongoClient("localhost", 27017);
    return new SimpleMongoDbFactory(mongoClient, "igamt-hl7");

  }

  @Bean
  public MongoTemplate mongoTemplate() throws Exception {

    MongoTemplate mongoTemplate = new MongoTemplate(mongoDbFactory());
    return mongoTemplate;

  }

}
