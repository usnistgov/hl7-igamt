package gov.nist.hit.hl7.igamt.web.app.service;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;

public interface MovingService {

	DocumentStructure moveDocumentToWorkspace(String documentId, DocumentType type, String workspaceId, String folderId, String username) throws Exception;
	void moveDocumentToPrivateScope(String documentId, DocumentType type, String username) throws Exception;

}
