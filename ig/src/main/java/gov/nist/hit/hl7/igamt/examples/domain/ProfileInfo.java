package gov.nist.hit.hl7.igamt.examples.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

public class ProfileInfo {
    private DisplayElement displayInfo;
    private DocumentInfo documentInfo;

    public DisplayElement getDisplayInfo() {
        return displayInfo;
    }

    public void setDisplayInfo(DisplayElement displayInfo) {
        this.displayInfo = displayInfo;
    }

    public DocumentInfo getDocumentInfo() {
        return documentInfo;
    }

    public void setDocumentInfo(DocumentInfo documentInfo) {
        this.documentInfo = documentInfo;
    }
}
