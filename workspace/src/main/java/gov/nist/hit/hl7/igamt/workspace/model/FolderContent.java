package gov.nist.hit.hl7.igamt.workspace.model;

import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;

import java.util.List;

public class FolderContent extends FolderInfo {
    private List<DocumentSummary> documents;

    public List<DocumentSummary> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentSummary> documents) {
        this.documents = documents;
    }
}
