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
package gov.nist.hit.hl7.igamt.service.impl;

import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontConfigurationService;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.export.domain.ExportParameters;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.ExportService;
import gov.nist.hit.hl7.igamt.export.util.WordUtil;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgExportService;
import gov.nist.hit.hl7.igamt.ig.service.IgSerializationService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
@Service("IgExportService")
public class IgExportServiceImpl implements IgExportService {

  @Autowired
  IgService igService;

  @Autowired
  IgSerializationService igSerializationService;

  @Autowired
  ExportService exportService;

  @Autowired
  ExportConfigurationService exportConfigurationService;

  @Autowired
  ExportFontConfigurationService exportFontConfigurationService;

  private static final String IG_XSLT_PATH = "/IGDocumentExport.xsl";



  @Override
  public ExportedFile exportIgDocumentToHtml(String username, String igDocumentId)
      throws ExportException {
    Ig igDocument = igService.findLatestById(igDocumentId);
    if (igDocument != null) {
      ExportedFile htmlFile =
          this.serializeIgDocumentToHtml(username, igDocument, ExportFormat.HTML);
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
  public ExportedFile exportIgDocumentToWord(String username, String igDocumentId)
      throws ExportException {
    Ig igDocument = igService.findLatestById(igDocumentId);
    if (igDocument != null) {
      ExportedFile htmlFile =
          this.serializeIgDocumentToHtml(username, igDocument, ExportFormat.WORD);
      ExportedFile wordFile = WordUtil.convertHtmlToWord(htmlFile, igDocument.getMetadata(), igDocument.getUpdateDate(), igDocument.getDomainInfo().getVersion());
      return wordFile;
    }
    return null;
  }

  /**
   * @param username
   * @param igDocumentId
   * @param exportFormat
   * @return
   * @throws SerializationException
   * @throws ExportException
   */
  private ExportedFile serializeIgDocumentToHtml(String username, Ig igDocument,
      ExportFormat exportFormat) throws ExportException {
    try {
      ExportConfiguration exportConfiguration =
          exportConfigurationService.getExportConfiguration(username);
      ExportFontConfiguration exportFontConfiguration =
          exportFontConfigurationService.getExportFontConfiguration(username);
      String xmlContent =
          igSerializationService.serializeIgDocument(igDocument, exportConfiguration);
      // TODO add appinfoservice to get app version
      ExportParameters exportParameters = new ExportParameters(false, true, exportFormat.getValue(),
          igDocument.getName(), igDocument.getMetadata().getCoverPicture(), exportConfiguration,
          exportFontConfiguration, "2.0_beta");
      InputStream htmlContent =
          exportService.exportSerializedElementToHtml(xmlContent, IG_XSLT_PATH, exportParameters);
      return new ExportedFile(htmlContent, igDocument.getName(), igDocument.getId(), exportFormat);
    } catch (SerializationException serializationException) {
      throw new ExportException(serializationException,
          "Unable to serialize IG Document with ID " + igDocument.getId());
    }
  }

}
