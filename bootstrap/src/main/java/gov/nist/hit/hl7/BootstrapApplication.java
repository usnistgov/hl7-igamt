package gov.nist.hit.hl7;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.web.MultipartAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import gov.nist.hit.hl7.factory.MessageEventFacory;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.shared.config.SharedConstant;
import gov.nist.hit.hl7.igamt.shared.config.SharedConstantService;

@SpringBootApplication

@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class,
    DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class,
    MultipartAutoConfiguration.class})
@EnableMongoRepositories("gov.nist.hit.hl7.igamt")
@ComponentScan({"gov.nist.hit.hl7.igamt.configuration", "gov.nist.hl7.igamt.shared.authentication",
    "gov.nist.hl7.igamt.shared.config", "gov.nist.hit.hl7.auth.util", "gov.nist.hit.hl7.factory",
    "gov.nist.hit.hl7.igamt.shared.util"})

public class BootstrapApplication implements CommandLineRunner {

  public static void main(String[] args) {
    SpringApplication.run(BootstrapApplication.class, args);

  }

  @Autowired
  MessageEventFacory messageEventFactory;
  @Autowired
  SharedConstantService sharedConstantService;

  @Autowired
  DatatypeLibraryService dataypeLibraryService;

  @Autowired
  DatatypeService dataypeService;

  @Bean
  public ShaPasswordEncoder encoder() {
    return new ShaPasswordEncoder(256);
  }

  @Bean(name = "multipartResolver")
  public CommonsMultipartResolver multipartResolver() {
    CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
    return multipartResolver;
  }
  // @Bean
  // public FilterRegistrationBean jwtFilter() {
  // final FilterRegistrationBean registrationBean = new FilterRegistrationBean();
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
//   System.out.println("creating message Event");
//   messageEventFactory.createMessageEvent();
//   }
  

   @PostConstruct
   void createSharedConstant() {
   SharedConstant constant= new SharedConstant();
   List<String> hl7Versions=new ArrayList<String>();
   hl7Versions.add("2.3.1");
   hl7Versions.add("2.4");
   hl7Versions.add("2.5");
   hl7Versions.add("2.5.1");
   hl7Versions.add("2.6");
   hl7Versions.add("2.7");
   hl7Versions.add("2.7.1");
   hl7Versions.add("2.8");
   hl7Versions.add("2.8.1");
   hl7Versions.add("2.8.2");
  
   List<String> usages=new ArrayList<String>();
  
   usages.add("R");
   usages.add("RE");
   usages.add("RC");
   usages.add("C");
   usages.add("X");
  
   constant.setHl7Versions(hl7Versions);
   constant.setUsages(usages);
  
  
   sharedConstantService.save(constant);
  
  
  
   }
  // @PostConstruct
  // void generateDatatypeLibrary()
  // throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {
  // DatatypeLibrary dataypeLibrary = dataypeLibraryService.createEmptyDatatypeLibrary();
  //
  // List<Datatype> intermasters = dataypeService.findByDomainInfoScope("INTERMASTER");
  // List<Datatype> masters = dataypeService.findByDomainInfoScope("MASTER");
  // if (masters.size() > 10 && intermasters.size() > 10)
  // for (int i = 0; i < 10; i++) {
  // if (intermasters.get(i) != null) {
  // Link l = new Link(intermasters.get(i).getId(), intermasters.get(i).getDomainInfo(), i);
  // dataypeLibrary.getDatatypeRegistry().getChildren().add(l);
  // }
  // if (masters.get(i) != null) {
  // Link l = new Link(masters.get(i).getId(), masters.get(i).getDomainInfo(), i);
  // dataypeLibrary.getDatatypeRegistry().getChildren().add(l);
  // }
  // }
  // dataypeLibraryService.save(dataypeLibrary);
  //
  // }


}
