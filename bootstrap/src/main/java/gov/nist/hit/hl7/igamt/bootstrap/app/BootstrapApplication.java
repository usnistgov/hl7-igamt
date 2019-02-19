package gov.nist.hit.hl7.igamt.bootstrap.app;


import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassifier;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.xreference.model.ReferenceType;
import gov.nist.hit.hl7.igamt.xreference.model.RelationShip;
import gov.nist.hit.hl7.igamt.xreference.model.ResourceInfo;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;

@SpringBootApplication
@EnableMongoAuditing
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class,
    DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@EnableMongoRepositories("gov.nist.hit.hl7.igamt")
@ComponentScan({"gov.nist.hit.hl7.igamt", "gov.nist.hit.hl7.auth.util.crypto",
    "gov.nist.hit.hl7.auth.util.service"})

public class BootstrapApplication implements CommandLineRunner {

  public static void main(String[] args) {
    SpringApplication.run(BootstrapApplication.class, args);

  }


//  @Autowired
//  ConfigService sharedConstantService;
//  
 
//  @Autowired
//  MessageEventFacory messageEventFactory;
  
  @Autowired
  RelationShipService testCache;

  @Autowired
  DatatypeLibraryService dataypeLibraryService;

  @Autowired
  DatatypeClassifier datatypeClassifier;
  
  @Autowired
  DatatypeService dataypeService;
  
  @Autowired
  DatatypeClassificationService datatypeClassificationService;
  
  @Bean
  public JavaMailSenderImpl mailSender() {
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost("smtp.nist.gov");
    mailSender.setPort(25);
    mailSender.setProtocol("smtp");
    Properties javaMailProperties = new Properties();
    javaMailProperties.setProperty("mail.smtp.auth", "false");
    javaMailProperties.setProperty("mail.debug", "true");

    mailSender.setJavaMailProperties(javaMailProperties);
    return mailSender;
  }

  @Bean
  public org.springframework.mail.SimpleMailMessage templateMessage() {
    org.springframework.mail.SimpleMailMessage templateMessage =
        new org.springframework.mail.SimpleMailMessage();
    templateMessage.setFrom("hl7-auth@nist.gov");
    templateMessage.setSubject("NIST HL7 Auth Notification");
    return templateMessage;
  }
  
//
//   @Bean(name = "multipartResolver")
//   public CommonsMultipartResolver multipartResolver() {
//   CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
//   return multipartResolver;
//   }
   
//   @Bean
//   public GridFsTemplate gridFsTemplate() throws Exception {
//       return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
//   }
  // @Bean
  // public FilterRegistrationBean jwtFilter() {
  // final FilterRegistrationBean registrationBean = new FilterRegistrationBean();Datatype
  // registrationBean.setFilter(new JwtFilter());
  // registrationBean.addUrlPatterns("/api/*");
  //
  // return registrationBean;
  // }


  @Override
  public void run(String... arg0) throws Exception {

    // accountService.findAll().get(0).getFullName();
    // List<Valueset> all = repo.findByDomainInfoScopeAndDomainInfoVersion("HL7STANDARD","2.7");
    // List<Valueset> bindingIdentifier = repo.findByBindingIdentifier("0001");
    // List<Valueset> scope = repo.findByDomainInfoScope("HL7STANDARD");
    // List<Valueset> scopeVersionIdentifier =
    // repo.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier("HL7STANDARD", "2.7",
    // "0001");
    //
    // List<Valueset> versionAndIDen=repo.findByDomainInfoScopeAndBindingIdentifier("HL7STANDARD",
    // "0001");
    //
    // System.out.println(all.size());
    // System.out.println(bindingIdentifier.size());
    // System.out.println(scope.size());
    // System.out.println(scopeVersionIdentifier.size());
    // System.out.println(versionAndIDen.size());


  }
  // @PostConstruct
  // void converAccounts() {
  //// try {
  //// Privilege user= new Privilege("USER");
  //// Privilege admin = new Privilege("ADMIN");
  ////
  //// priviliges.save(user);
  //// priviliges.save(admin);
  ////
  //// accountService.createAccountsFromLegacy();
  //// } catch (IOException e) {
  //// // TODO Auto-generated catch block
  //// e.printStackTrace();
  //// }
  //
  // }

  //
//   @PostConstruct
//   void createMessageEvent() {
//    messageEventFactory.createMessageEvent();
//    System.out.println("done");
//   }
//  
   //
//    @PostConstruct
//   void createSharedConstant() {
//    Config constant = new Config();
//    List<String> hl7Versions = new ArrayList<String>();
//    hl7Versions.add("2.3.1");
//    hl7Versions.add("2.4");
//    hl7Versions.add("2.5");
//    hl7Versions.add("2.5.1");
//    hl7Versions.add("2.6");
//    hl7Versions.add("2.7");
//    hl7Versions.add("2.7.1");
//    hl7Versions.add("2.8");
//    hl7Versions.add("2.8.1");
//    hl7Versions.add("2.8.2");
//   
//    List<String> usages = new ArrayList<String>();
//   
//    usages.add("R");
//    usages.add("RE");
//    usages.add("RC");
//    usages.add("C");
//    usages.add("X");
//    constant.setHl7Versions(hl7Versions);
//    constant.setUsages(usages);
//    sharedConstantService.save(constant);
//  
//   }
  //
  // // @PostConstruct
  // void generateDatatypeLibrary()
  // throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {
  // // DatatypeLibrary dataypeLibrary = dataypeLibraryService.createEmptyDatatypeLibrary();
  // //
  // // List<Datatype> intermasters = dataypeService.findByDomainInfoScope("INTERMASTER");
  // // List<Datatype> masters = dataypeService.findByDomainInfoScope("MASTER");
  // // if (masters.size() > 10 && intermasters.size() > 10)
  // // for (int i = 0; i < 10; i++) {
  // // if (intermasters.get(i) != null) {
  // // Link l = new Link(intermasters.get(i).getId(), intermasters.get(i).getDomainInfo(), i);
  // // dataypeLibrary.getDatatypeRegistry().getChildren().add(l);
  // // }
  // // if (masters.get(i) != null) {
  // // Link l = new Link(masters.get(i).getId(), masters.get(i).getDomainInfo(), i);
  // // dataypeLibrary.getDatatypeRegistry().getChildren().add(l);
  // // }
  // // }
  // // dataypeLibraryService.save(dataypeLibrary);
  //
  // }

//   @PostConstruct
//   void classifyDatatypes() throws DatatypeNotFoundException {
//   datatypeClassificationService.deleteAll();
//   System.out.println("Classifying dts");
//   datatypeClassifier.classify();
//   System.out.println("ENd of Classifying dts");
//  
//   }
//  
@PostConstruct
void testCache() {
	testCache.deleteAll();

  ResourceInfo info = new ResourceInfo();
  info.setId("user");
  info.setDomainInfo(null);
  info.setType(null);
  
  ResourceInfo info1 = new ResourceInfo();
  info1.setId("user1");
  info1.setDomainInfo(null);
  info1.setType(null);
  
  
  RelationShip r1 = new RelationShip(info, info1, ReferenceType.STRUCTURE, "test");
  RelationShip r2 = new RelationShip(info1, info, ReferenceType.STRUCTURE, "test");

  
  testCache.save(r1);
  testCache.save(r2);
  
  System.out.println(testCache.findAll().size());
  
  List<RelationShip> dep =testCache.findAllDependencies("user");
  List<RelationShip>  refs=testCache.findCrossReferences("user");
  
  List<RelationShip>  byType=testCache.findByPath("test");
  List<RelationShip>  all=testCache.findAll();
  
  for( RelationShip r :all) {
	  System.out.println(r.getId());
  }
  System.out.println(dep);
  System.out.println(refs);

}

}
