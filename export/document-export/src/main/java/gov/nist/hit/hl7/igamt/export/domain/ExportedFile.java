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
package gov.nist.hit.hl7.igamt.export.domain;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;



/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
public class ExportedFile {

  private InputStream content;
  
  private XSSFWorkbook excelContent;
  
  private String fileName;


  public XSSFWorkbook getExcelContent() {
	return excelContent;
}

public void setExcelContent(XSSFWorkbook excelContent) {
	this.excelContent = excelContent;
}


  public ExportedFile(InputStream content, String documentTitle, String documentKey,
      ExportFormat exportFormat) {
    super();
    this.content = content;
    this.setFileName(documentTitle, documentKey, exportFormat);
  }

  public InputStream getContent() {
    return content;
  }

  public void setContent(InputStream content) {
    this.content = content;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String documentTitle, String documentKey,
      ExportFormat exportFormat) {
    documentTitle = this.cleanDocumentTitle(documentTitle != null ? documentTitle : "Document");
    this.fileName =
        documentTitle + "-" + documentKey  + "_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + "."
            + exportFormat.getValue();
    System.out.println("wqlo");
  }

  private String cleanDocumentTitle(String documentTitle) {
    return documentTitle.replaceAll(" ", "-").replaceAll("\\*", "-").replaceAll("\"", "-")
        .replaceAll(":", "-").replaceAll(";", "-").replaceAll("=", "-").replaceAll(",", "-");
  }



}
