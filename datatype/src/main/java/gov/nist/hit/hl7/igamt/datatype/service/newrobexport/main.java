package gov.nist.hit.hl7.igamt.datatype.service.newrobexport;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@ComponentScan("gov.nist")
@EnableMongoRepositories("gov.nist.hit.hl7.igamt")
@SpringBootApplication
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
public class main {

	@Autowired
	private MasterDatatypeLibraryExportService mds;
	
	public static void main(String[] args) throws JSONException {
		
		SpringApplication.run(main.class, args);
		
	}
	
	@PostConstruct
	public void postConstruct() {
		System.out.println("DONE");
		 JSONExtractor je = new JSONExtractor();
		MyExportObject myExportObject = mds.serializeMasterDatatypeLib((je.extract()));
		HtmlWriter hw = new HtmlWriter();
		PageCreator pg = new PageCreator();
		BasicXsl bx = new BasicXsl();
		hw.generateVersionInIndex(myExportObject);
//		bx.BuildXMLfromMap(myExportObject.getDatatypesXMLOneByOne());
		pg.generateLeafPageTable(myExportObject);
		pg.generateIndex(myExportObject);
		try {
			hw.generateHtmlNameThenVersion(myExportObject);
			hw.generateHtmlVersionsThenName(myExportObject);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 System.out.println("END-HT");

	}

}
