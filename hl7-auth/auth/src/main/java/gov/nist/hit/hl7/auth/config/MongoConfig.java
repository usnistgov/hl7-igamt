package gov.nist.hit.hl7.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;

@Configuration
@EnableMongoRepositories(basePackages = {"gov.nist.hit.hl7.auth.repository"})

public class MongoConfig extends AbstractMongoConfiguration {
  @Autowired
  Environment env;

  private static final String DB_NAME = "db.name";
  private static final String DB_HOST = "db.host";
  private static final String DB_PORT = "db.port";


  @Override
  protected String getDatabaseName() {
    return env.getProperty(DB_NAME);
  }


  @Override
  public Mongo mongo() throws Exception {
    return new MongoClient(
        new ServerAddress(env.getProperty(DB_HOST), Integer.parseInt(env.getProperty(DB_PORT))));
  }

  @Override
  protected String getMappingBasePackage() {
    return "gov.nist.hit.hl7.auth";
  }

}
