package gov.nist.hit.hl7.igamt.xreference;

//
// @Configuration
// @EnableMongoRepositories(basePackages = {"gov.nist.hit.hl7.igamt"})
public class TestMongoConfig {

  private static final String MONGO_DB_URL = "localhost";
  private static final String MONGO_DB_NAME = "embeded_db";

  // @Bean
  // public MongoTemplate mongoTemplate() throws IOException {
  // EmbeddedMongoFactoryBean mongo = new EmbeddedMongoFactoryBean();
  // mongo.setBindIp(MONGO_DB_URL);
  // MongoClient mongoClient = mongo.getObject();
  // MongoTemplate mongoTemplate = new MongoTemplate(mongoClient, MONGO_DB_NAME);
  // return mongoTemplate;
  // }

}
