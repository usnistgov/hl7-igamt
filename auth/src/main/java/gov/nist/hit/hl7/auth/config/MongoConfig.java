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
@EnableMongoRepositories(basePackages={"gov.nist.hit.hl7.auth.repository"})

public class MongoConfig extends AbstractMongoConfiguration {
	@Autowired
	Environment env;
	
	@Override
	protected String getDatabaseName() {
		//return env.getProperty("userdb");
		return "igamt-user";
	}
	@Override
	protected String getAuthenticationDatabaseName() {
		// TODO Auto-generated method stub
		return env.getProperty("userdb");
	}

	@Override
	public Mongo mongo() throws Exception {
		//return new MongoClient(new ServerAddress(env.getProperty("host"),27017));
		return new MongoClient(new ServerAddress(env.getProperty("localhost"),27017));

	}
	
	@Override
	protected String getMappingBasePackage() {
		return "gov.nist.hit.hl7.auth";
	}

}