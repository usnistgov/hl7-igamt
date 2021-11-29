package gov.nist.hit.hl7.igamt.legacy.service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;

@Configuration
@EnableMongoRepositories("gov.nist.hit.hl7.igamt.legacy.repository")
public class LegacyApplicationConfig extends AbstractMongoConfiguration {






  @Override
  protected String getDatabaseName() {
    return "igamt";
  }

  @Override
  public MongoClient mongoClient() {
    return new MongoClient(new ServerAddress("localhost", 27017));
  }


}


