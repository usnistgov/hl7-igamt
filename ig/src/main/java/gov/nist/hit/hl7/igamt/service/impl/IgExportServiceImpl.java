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

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.ExportService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgExportService;
import gov.nist.hit.hl7.igamt.ig.service.IgSerializationService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
public class IgExportServiceImpl implements IgExportService {

  @Autowired 
  IgService igService;
  
  @Autowired
  IgSerializationService igSerializationService;
  
  @Autowired
  ExportService exportService;
  
  @Override
  public ExportedFile exportIgDocumentToHtml(String igDocumentId) throws ExportException {
    Ig igDocument = igService.findLatestById(igDocumentId);
    if(igDocument != null) {
      try {
        String xmlContent = igSerializationService.serializeIgDocument(igDocument);
        return exportService.exportSerializedElementToHtml(xmlContent);
      } catch (SerializationException | ExportException e) {
        throw new ExportException(e,"Error while exporting IG Document with ID " + igDocument.getId().toString());
      }
    }
    return null;
  }

}
