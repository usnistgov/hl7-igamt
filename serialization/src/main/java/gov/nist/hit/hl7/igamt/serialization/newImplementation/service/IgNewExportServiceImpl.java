//package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;
//
//import java.io.InputStream;
//
//import org.apache.commons.lang3.SerializationException;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
//import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
//import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
//import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontConfigurationService;
//import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
//import gov.nist.hit.hl7.igamt.export.domain.ExportParameters;
//import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
//import gov.nist.hit.hl7.igamt.export.exception.ExportException;
//import gov.nist.hit.hl7.igamt.export.service.ExportService;
//import gov.nist.hit.hl7.igamt.ig.domain.Ig;
//import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
//import gov.nist.hit.hl7.igamt.ig.service.IgService;
//
//public class IgNewExportServiceImpl implements IgNewExportService {
//	
//  @Autowired
//  IgService igService;
//  
//  @Autowired
//  ExportConfigurationService exportConfigurationService;
//
//  @Autowired
//  ExportFontConfigurationService exportFontConfigurationService;
//  
//  @Autowired
//  IgDataModelSerializationService igDataModelSerializationService;
//  
//  @Autowired
//  ExportService exportService;
//  
//  private static final String IG_XSLT_PATH = "/IGDocumentExport.xsl";
//
//	 public ExportedFile exportIgDocumentToHtml(String username, String igDocumentId) throws Exception {
//		    Ig igDocument = igService.findById(igDocumentId);
//		    if (igDocument != null) {
//		      ExportedFile htmlFile =
//		          this.serializeIgDocumentToHtml(username, igDocument, ExportFormat.HTML);
//		      return htmlFile;
//		    }
//		    return null;
//		  }
//	 
//	 private ExportedFile serializeIgDocumentToHtml(String username, Ig igDocument,
//		      ExportFormat exportFormat) throws Exception {
//		    try {
//		      ExportConfiguration exportConfiguration =
//		          exportConfigurationService.getExportConfiguration(username);
//		      ExportFontConfiguration exportFontConfiguration =
//		          exportFontConfigurationService.getExportFontConfiguration(username);
////		      String xmlContent =
////		          igSerializationService.serializeIgDocument(igDocument, exportConfiguration); 
//		      IgDataModel igDataModel = igService.generateDataModel(igDocument);
//		      String xmlContent =
//		              igDataModelSerializationService.serializeIgDocument(igDataModel, exportConfiguration).toXML(); 
////		      System.out.println("XmlContent in IgExportService is : " + xmlContent);
//		      	// TODO add app infoservice to get app version
//		      ExportParameters exportParameters = new ExportParameters(false, true, exportFormat.getValue(),
//		          igDocument.getName(), igDocument.getMetadata().getCoverPicture(), exportConfiguration,
//		          exportFontConfiguration, "2.0_beta");
//		      InputStream htmlContent =
//		          exportService.exportSerializedElementToHtml(xmlContent, IG_XSLT_PATH, exportParameters);
//		      ExportedFile exportedFile = new ExportedFile(htmlContent, igDocument.getName(), igDocument.getId(), exportFormat);
//		      exportedFile.setContent(htmlContent);
////		      return new ExportedFile(htmlContent, igDocument.getName(), igDocument.getId(), exportFormat);
//		      
//		      return exportedFile;
//		    } catch (SerializationException  serializationException) {
//		      throw new ExportException(serializationException,
//		          "Unable to serialize IG Document with ID " + igDocument.getId());
//		    }
//		  }
//
//}
