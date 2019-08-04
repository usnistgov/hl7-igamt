package gov.nist.hit.hl7.igamt.export.service;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

public interface IgNewExportService {

	public ExportedFile exportIgDocumentToHtml(String username, String igDocumentId) throws Exception;
	
	public ExportFilterDecision getExportFilterDecision(Ig ig, ExportConfiguration config);
		
}
