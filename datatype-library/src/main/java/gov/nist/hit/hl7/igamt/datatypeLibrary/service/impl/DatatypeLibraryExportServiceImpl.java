package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;



import java.io.IOException;

/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryExportService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibrarySerializationService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.webExport.util.BasicXsl;
import gov.nist.hit.hl7.igamt.datatypeLibrary.webExport.util.HtmlWriter;
import gov.nist.hit.hl7.igamt.datatypeLibrary.webExport.util.PageCreator;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontConfigurationService;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.export.domain.ExportParameters;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.ExportService;
import gov.nist.hit.hl7.igamt.export.util.WordUtil;

import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;


/**
 *
 * @author Bouij Youssef on July 20, 2018.
 */
@Service("DatatypeLibraryExportService")
public class DatatypeLibraryExportServiceImpl implements DatatypeLibraryExportService {

  @Autowired
  DatatypeLibraryService datatypeLibraryService;

  @Autowired
  DatatypeLibrarySerializationService datatypeLibrarySerializationService;

  @Autowired
  ExportService exportService;

  @Autowired
  ExportConfigurationService exportConfigurationService;

  @Autowired
  ExportFontConfigurationService exportFontConfigurationService;

  private static final String IG_XSLT_PATH = "/IGDocumentExport.xsl";



  @Override
  public ExportedFile exportDatatypeLibraryToHtml(String username, String datatypeLibraryId)
      throws ExportException {
	  DatatypeLibrary datatypeLibrary = datatypeLibraryService.findLatestById(datatypeLibraryId);
    if (datatypeLibrary != null) {
      ExportedFile htmlFile =
          this.serializeDatatypeLibraryToHtml(username, datatypeLibrary, ExportFormat.HTML);
      return htmlFile;
    }
    return null;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.ig.service.IgExportService#exportIgDocumentToWord(java.lang.String,
   * java.lang.String)
   */
  @Override
  public ExportedFile exportDatatypeLibraryToWord(String username, String datatypeLibraryId)
      throws ExportException {
	  DatatypeLibrary datatypeLibrary = datatypeLibraryService.findLatestById(datatypeLibraryId);
    if (datatypeLibrary != null) {
      ExportedFile htmlFile =
          this.serializeDatatypeLibraryToHtml(username, datatypeLibrary, ExportFormat.WORD);
      ExportedFile wordFile = WordUtil.convertHtmlToWord(htmlFile, datatypeLibrary.getMetadata(), datatypeLibrary.getUpdateDate(), datatypeLibrary.getDomainInfo() != null ? datatypeLibrary.getDomainInfo().getVersion() : "");
      return wordFile;
    }
    return null;
  }

  /**
   * @param username
   * @param datatypeLibraryId
   * @param exportFormat
   * @return
   * @throws SerializationException
   * @throws ExportException
   */
  private ExportedFile serializeDatatypeLibraryToHtml(String username, DatatypeLibrary datatypeLibrary,
      ExportFormat exportFormat) throws ExportException {
    try {
      ExportConfiguration exportConfiguration =
          exportConfigurationService.getExportConfiguration(username);
      List<NameAndPositionAndPresence> columns = new ArrayList<>();
      for(NameAndPositionAndPresence column : exportConfiguration.getDatatypeColumn().getColumns()) {
    	  	if(column.getName().equals("Value Set")) {
    	  		column.setPresent(false);
    	  	}
    	  	columns.add(column);
      }
      exportConfiguration.getDatatypeColumn().setColumns(columns);
      ExportFontConfiguration exportFontConfiguration =
          exportFontConfigurationService.getExportFontConfiguration(username);
      String xmlContent =
    		  datatypeLibrarySerializationService.serializeDatatypeLibrary(datatypeLibrary, exportConfiguration);
      // TODO add appinfoservice to get app version
      ExportParameters exportParameters = new ExportParameters(false, true, exportFormat.getValue(),
    		  datatypeLibrary.getName() != null ? datatypeLibrary.getName() : "", datatypeLibrary.getMetadata() != null ? datatypeLibrary.getMetadata().getCoverPicture() : "", exportConfiguration,
          exportFontConfiguration, "2.0_beta");
      InputStream htmlContent =
          exportService.exportSerializedElementToHtml(xmlContent, IG_XSLT_PATH, exportParameters);
      return new ExportedFile(htmlContent, datatypeLibrary.getName(), datatypeLibrary.getId(), exportFormat);
    } catch (SerializationException serializationException) {
      throw new ExportException(serializationException,
          "Unable to serialize IG Document with ID " + datatypeLibrary.getId().getId());
    }
  }

@Override
public ExportedFile exportDatatypeLibraryToWeb(String username, String datatypeLibraryId) throws ExportException {
	  DatatypeLibrary datatypeLibrary = datatypeLibraryService.findLatestById(datatypeLibraryId);
	    if (datatypeLibrary != null) {
	      ExportedFile htmlFile =
	          this.serializeDatatypeLibraryToWeb(username, datatypeLibrary, ExportFormat.HTML);
	      return htmlFile;
	    }
	    return null;
	  }

private ExportedFile serializeDatatypeLibraryToWeb(String username, DatatypeLibrary datatypeLibrary,
	      ExportFormat exportFormat) throws ExportException {
	try {
	 ExportConfiguration exportConfiguration =
	          exportConfigurationService.getExportConfiguration(username);
	ExportFontConfiguration exportFontConfiguration =
	          exportFontConfigurationService.getExportFontConfiguration(username);
		String xmlContent =
			  datatypeLibrarySerializationService.serializeDatatypeLibrary(datatypeLibrary, exportConfiguration);
	} catch (SerializationException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return null;
	
}


}
