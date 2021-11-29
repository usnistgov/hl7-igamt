package gov.nist.hit.hl7.igamt.xreference;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;

@Configuration
@EnableMongoRepositories(basePackages = {"gov.nist.hit.hl7.igamt"})
@ComponentScan("gov.nist.hit.hl7.igamt")

public class DataMongoConfig extends AbstractMongoConfiguration {


  @Autowired
  Environment env;


  private static final String DB_NAME = "igamt-hl7";
  private static final String DB_HOST = "localhost";
  private static final String DB_PORT = "27017";

  @Override
  protected String getDatabaseName() {
    return DB_NAME;
  }

  @Override
  public MongoClient mongoClient() {

    return new MongoClient(new ServerAddress(DB_HOST, Integer.parseInt(DB_PORT)));
  }

  @Override
  protected String getMappingBasePackage() {
    return "gov.nist.hit.hl7.igamt";
  }





}
