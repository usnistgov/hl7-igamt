package gov.nist.hit.hl7.igamt.export.service;

import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

public interface DlNewExportService {

    public ExportedFile exportDlDocumentToHtml(String username, String dlDocumentId, ExportFilterDecision decision, String configId) throws Exception;
    
    public ExportFilterDecision getExportFilterDecision(DatatypeLibrary dl, ExportConfiguration config) throws EntityNotFound;
    public  ExportedFile serializeDlDocumentToHtml(String username, DatatypeLibrary dl,
            ExportFormat exportFormat, ExportFilterDecision decision, ExportConfiguration exportConfiguration) throws Exception;

    public ExportedFile exportDlDocumentToWord(String username, String id, ExportFilterDecision decision, String configId ) throws Exception;
        
}
