package gov.nist.hit.hl7.igamt.web.export.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.xml.transform.TransformerException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;
import gov.nist.hit.hl7.igamt.web.export.service.DatatypeLibraryPopulateObjectService;
import gov.nist.hit.hl7.igamt.web.export.service.DatatypeLibraryWebExportService;
import gov.nist.hit.hl7.igamt.web.export.util.BasicXsl;
import gov.nist.hit.hl7.igamt.web.export.util.HtmlWriter;
import gov.nist.hit.hl7.igamt.web.export.util.PageCreator;

@Component

public class DatatypeLibraryWebExportServiceImpl implements DatatypeLibraryWebExportService  {
	
	Map<String,Datatype> datatypesMap = new HashMap<>();


  @Autowired
  DatatypeLibraryService datatypeLibraryService;
  
  @Autowired
  DatatypeLibraryPopulateObjectService datatypeLibraryPopulateObjectService;
  
  @Autowired
  DatatypeService datatypeService;
  
  @Autowired
  MyExportObject myExportObject;
	
	@Override
	public void exportDatatypeLibraryToWeb(String username, String datatypeLibraryId) throws ExportException {
		
		  DatatypeLibrary datatypeLibrary = datatypeLibraryService.findLatestById(datatypeLibraryId);
		  
		    if (datatypeLibrary != null) {
		    	try {
		    	datatypesMap = initializeDatatypesMap(datatypeLibrary.getDatatypeRegistry());
		    	datatypesMap = initializeDatatypesMap(datatypeLibrary.getDerivedRegistry());
		    	datatypeLibraryPopulateObjectService.populateExportObject(datatypesMap);
		    	
		    	HtmlWriter hw = new HtmlWriter();
				PageCreator pg = new PageCreator();
				BasicXsl bx = new BasicXsl();
				hw.generateVersionInIndex(myExportObject);
//				bx.BuildXMLfromMap(myExportObject.getDatatypesXMLOneByOne());
				pg.generateLeafPageTable(myExportObject);
				pg.generateIndex(myExportObject);
				System.out.println("Je suis apres generateIndex  ");
				
					hw.generateHtmlNameThenVersion(myExportObject);
					hw.generateHtmlVersionsThenName(myExportObject);

					System.out.println("Je suis apres generateHtmlVersionsThenName  ");

				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (DatatypeNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (TransformerException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				 System.out.println("END-HT");

		    }

	
	}
	
	private Map<String,Datatype> initializeDatatypesMap(Registry datatypeLibrary) throws DatatypeNotFoundException {
		Map<String,Datatype> datatypesMap = new HashMap<>();
		    for (Link datatypeLink : datatypeLibrary.getChildren()) {
		      if (datatypeLink != null && datatypeLink.getId() != null
		          && !datatypesMap.containsKey(datatypeLink.getId().getId())) {
		        Datatype datatype = datatypeService.findByKey(datatypeLink.getId());
		        if (datatype != null) {
		          datatypesMap.put(datatypeLink.getId().getId(), datatype);
		        } else {
		          throw new DatatypeNotFoundException(datatypeLink.getId().getId());
		        }
		      }
		    }
			return datatypesMap;
		    
		  }

}
