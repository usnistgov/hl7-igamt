package gov.nist.hit.hl7.igamt.export.service;

import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;

public interface IgNewExportService {

	public ExportedFile exportIgDocumentToHtml(String username, String igDocumentId) throws Exception;
}
