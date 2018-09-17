//package gov.nist.hit.hl7.igamt.web.export;
//
//import java.io.IOException;
//
//import javax.annotation.PostConstruct;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
//import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
//import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
//import org.springframework.context.annotation.AnnotationConfigApplicationContext;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.support.AbstractApplicationContext;
//import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
//
//import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;
//
//@Configuration
//@ComponentScan("gov.nist")
//@EnableMongoRepositories("gov.nist.hit.hl7.igamt")
//@SpringBootApplication
//@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
//public class main {
//
//	@Autowired
//	private MasterDatatypeLibraryExportService mds;
//	
//	public static void main(String[] args)  {
//		
//		SpringApplication.run(main.class, args);
//		
//	}
//	
//	@PostConstruct
//	public void postConstruct() {
//		createWebSiteForDatatypeLibraryExport();
//	}
//	
//	public void createWebSiteForDatatypeLibraryExport() {
////
////		System.out.println("DONE");
////		 JSONExtractor je = new JSONExtractor();
////		MyExportObject myExportObject = mds.serializeMasterDatatypeLib((je.extract()));
////		HtmlWriter hw = new HtmlWriter();
////		PageCreator pg = new PageCreator();
////		BasicXsl bx = new BasicXsl();
////		hw.generateVersionInIndex(myExportObject);
//////		bx.BuildXMLfromMap(myExportObject.getDatatypesXMLOneByOne());
////		pg.generateLeafPageTable(myExportObject);
////		pg.generateIndex(myExportObject);
////		try {
////			hw.generateHtmlNameThenVersion(myExportObject);
////			hw.generateHtmlVersionsThenName(myExportObject);
////
////		} catch (IOException e) {
////			// TODO Auto-generated catch block
////			e.printStackTrace();
////		}
////		 System.out.println("END-HT");
//
//	
//	}
//
//}
