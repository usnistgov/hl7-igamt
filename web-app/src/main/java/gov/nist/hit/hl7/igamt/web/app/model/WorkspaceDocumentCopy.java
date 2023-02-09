package gov.nist.hit.hl7.igamt.web.app.model;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;

public class WorkspaceDocumentCopy {

	private String documentId;
	private DocumentType documentType;
	private String workspaceId;
	private String folderId;
	private String name;
	private CopyInfo copyInfo;

	public String getDocumentId() {
		return documentId;
	}

	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}

	public DocumentType getDocumentType() {
		return documentType;
	}

	public void setDocumentType(DocumentType documentType) {
		this.documentType = documentType;
	}

	public String getWorkspaceId() {
		return workspaceId;
	}

	public void setWorkspaceId(String workspaceId) {
		this.workspaceId = workspaceId;
	}

	public String getFolderId() {
		return folderId;
	}

	public void setFolderId(String folderId) {
		this.folderId = folderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public CopyInfo getCopyInfo() {
		return copyInfo;
	}

	public void setCopyInfo(CopyInfo copyInfo) {
		this.copyInfo = copyInfo;
	}
}
