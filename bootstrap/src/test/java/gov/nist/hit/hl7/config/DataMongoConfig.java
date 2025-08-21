package gov.nist.hit.hl7.config;

import com.mongodb.MongoClientSettings;
import jakarta.annotation.Nonnull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import com.mongodb.ServerAddress;

import java.util.Collections;

@Configuration
@EnableMongoRepositories(basePackages = {"gov.nist.hit.hl7.igamt"})
@ComponentScan("gov.nist.hit.hl7.igamt")
public class DataMongoConfig extends AbstractMongoClientConfiguration {

  private static final String DB_NAME = "igamt-hl7";
  private static final String DB_HOST = "localhost";
  private static final String DB_PORT = "27017";

  @Override
  @Nonnull
  public String getDatabaseName() {
    return DB_NAME;
  }

  @Override
  protected void configureClientSettings(MongoClientSettings.Builder builder) {
    builder.applyToClusterSettings(settings -> {
      settings.hosts(Collections.singletonList(
              new ServerAddress(DB_HOST, Integer.parseInt(DB_PORT))
      ));
    });
  }

  @Bean
  public GridFsTemplate gridFsTemplate(MongoConverter mongoConverter) {
    return new GridFsTemplate(mongoDbFactory(), mongoConverter);
  }

}
