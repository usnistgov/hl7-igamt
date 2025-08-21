package gov.nist.hit.hl7.igamt.bootstrap.configuration;


import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import jakarta.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Value;
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

  @Value("${db.host}")
  private String HOST;
  @Value("${db.port}")
  private String PORT;
  @Value("${db.name}")
  private String NAME;
  @Value("${db.username:}")
  private String USERNAME;
  @Value("${db.password:}")
  private String PASSWORD;
  @Value("${db.auth.source:}")
  private String AUTH_SOURCE;

  @Override
  @Nonnull
  public String getDatabaseName() {
    return NAME;
  }

  @Override
  protected void configureClientSettings(MongoClientSettings.Builder builder) {
    if(USERNAME != null && PASSWORD != null && !USERNAME.isEmpty() && !PASSWORD.isEmpty()) {
      MongoCredential credential = MongoCredential.createCredential(
              USERNAME,
              AUTH_SOURCE,
              PASSWORD.toCharArray()
      );
      builder.credential(credential);
    }
    builder.applyToClusterSettings(settings -> {
      settings.hosts(Collections.singletonList(
              new ServerAddress(HOST, Integer.parseInt(PORT))
      ));
    });
  }

  @Bean
  public GridFsTemplate gridFsTemplate(MongoConverter mongoConverter) {
      return new GridFsTemplate(mongoDbFactory(), mongoConverter);
  }

}
