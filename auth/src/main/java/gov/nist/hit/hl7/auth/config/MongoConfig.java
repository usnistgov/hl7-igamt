package gov.nist.hit.hl7.auth.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;

@Configuration
@EnableMongoRepositories(basePackages={"gov.nist.hit.hl7.auth"})
public class MongoConfig extends AbstractMongoConfiguration {
//	@Autowired
//	private Environment env;
	
//	@Value("${spring.data.mongodb.authentication-database}")
//	private String dbName;
//	
//	@Value("${spring.data.mongodb.host}")
//	private String mongoHost;
//
////	@Value("${spring.data.mongodb.port}")
////	private int port;
	
	
	@Override
	protected String getDatabaseName() {
//		return env.getProperty("spring.data.mongodb.authentication-database");
		return "igamt-user";
	}

	@Override
	public Mongo mongo() throws Exception {
		
//		return new MongoClient(new ServerAddress(env.getProperty("spring.data.mongodb.host"),27017));
		return new MongoClient(new ServerAddress("127.0.0.1",27017));

	}

	@Override
	protected String getMappingBasePackage() {
		return "gov.nist.hit.hl7.auth";
	}

}