package gov.nist.hit.hl7.igamt.web.app.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class WorkspaceDocumentMove {
    private String workspaceId;
    private String sourceFolderId;
    private String documentId;
    private Type documentType;
    private String title;
    private String folderId;
    private boolean clone;

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public Type getDocumentType() {
        return documentType;
    }

    public void setDocumentType(Type documentType) {
        this.documentType = documentType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFolderId() {
        return folderId;
    }

    public void setFolderId(String folderId) {
        this.folderId = folderId;
    }

    public boolean isClone() {
        return clone;
    }

    public void setClone(boolean clone) {
        this.clone = clone;
    }

    public String getSourceFolderId() {
        return sourceFolderId;
    }

    public void setSourceFolderId(String sourceFolderId) {
        this.sourceFolderId = sourceFolderId;
    }
}
