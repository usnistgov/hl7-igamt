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
package gov.nist.hit.hl7.igamt.export.service.impl;

import java.io.File;
import java.io.InputStream;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.export.domain.ExportParameters;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.ExportService;
import gov.nist.hit.hl7.igamt.export.util.HtmlUtil;
import gov.nist.hit.hl7.igamt.export.util.TransformationUtil;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
@Service("exportService")
public class ExportServiceImpl implements ExportService {

  // private static String DOCUMENT_TITLE_IMPLEMENTATION_GUIDE = "Implementation Guide";
  // private static String DOCUMENT_TITLE_DATATYPE_LIBRARY = "Datatype Library";
  // private static String EXPORT_FORMAT_HTML = "html";
  // private static String EXPORT_FORMAT_WORD = "word";
  private static String GLOBAL_STYLESHEET = "/generalExport.xsl";

  @Override
  public InputStream exportSerializedElementToHtml(String serializedElement, String xsltPath,
      ExportParameters exportParameters) throws ExportException {
    try {
      File htmlFile = TransformationUtil.doTransformToTempHtml(serializedElement,
          xsltPath != null ? xsltPath : GLOBAL_STYLESHEET, exportParameters);
      InputStream htmlInputStream = FileUtils.openInputStream(htmlFile);
      return HtmlUtil.cleanHtml(htmlInputStream);
    } catch (Exception exception) {
      throw new ExportException(exception);
    }
  }



}
