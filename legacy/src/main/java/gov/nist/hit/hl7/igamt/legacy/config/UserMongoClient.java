package gov.nist.hit.hl7.igamt.legacy.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;

public class UserMongoClient {

@Configuration
@EnableMongoRepositories("gov.nist.hit.hl7.auth.repository")
@ComponentScan("gov.nist.hit.hl7.auth")

public class ApplicationConfig {

  @Bean
  public MongoDbFactory mongoDbFactory() throws Exception {

    MongoClient mongoClient = new MongoClient("localhost", 27017);
    return new SimpleMongoDbFactory(mongoClient, "igamt-user");

  }

  @Bean
  public MongoTemplate mongoTemplate() throws Exception {

    MongoTemplate mongoTemplate = new MongoTemplate(mongoDbFactory());
    return mongoTemplate;

  }
}
}