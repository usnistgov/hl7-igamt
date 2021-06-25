package gov.nist.hit.hl7.igamt.export.service;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;

public interface IgNewExportService {

	public String exportIgDocumentToDiffXml( String igDocumentId) throws Exception;
	public String exportIgDocumentToDiffXml( Ig ig) throws Exception;
	public String serializeIgDocumentToDiffXml( Ig igDocument) throws Exception;

	public ExportFilterDecision getExportFilterDecision(DocumentStructure documentStructure, ExportConfiguration config) throws CoConstraintGroupNotFoundException, IGDeltaException;
//	public  ExportedFile serializeIgDocumentToHtml(String username,
//			ExportFormat exportFormat, ExportFilterDecision decision, ExportConfiguration exportConfiguration) throws Exception;
//

	ExportedFile serializeIgDocumentToHtml(String username, IgDataModel igDataModel,
			ExportFormat exportFormat, ExportFilterDecision decision, ExportConfiguration exportConfiguration)
			throws Exception;
	
	ExportedFile exportIgDocumentToHtml(String username, IgDataModel igDataModel, ExportFilterDecision decision,
			String configId) throws Exception;
	ExportedFile exportIgDocumentToWord(String username, IgDataModel igDatamodel, ExportFilterDecision decision,
			String configId) throws Exception;
	
	


		
}
