package gov.nist.hit.hl7.igamt.export.service;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

public interface IgNewExportService {

	public ExportedFile exportIgDocumentToHtml(String username, String igDocumentId, ExportFilterDecision decision, String configId) throws Exception;
	
	public ExportFilterDecision getExportFilterDecision(Ig ig, ExportConfiguration config);
	public  ExportedFile serializeIgDocumentToHtml(String username, Ig igDocument,
			ExportFormat exportFormat, ExportFilterDecision decision, ExportConfiguration exportConfiguration) throws Exception;

	public ExportedFile exportIgDocumentToWord(String username, String id, ExportFilterDecision decision, String configId ) throws Exception;
		
}
