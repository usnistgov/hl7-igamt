package gov.nist.hit.hl7.igamt.display.model;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;

import java.util.Date;

public class IgUpdateInfo {
    Date updateDate;
    String resourceVersionSyncToken;

    public IgUpdateInfo(Date updateDate, String resourceVersionSyncToken) {
        this.updateDate = updateDate;
        this.resourceVersionSyncToken = resourceVersionSyncToken;
    }

    public IgUpdateInfo() {
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public String getResourceVersionSyncToken() {
        return resourceVersionSyncToken;
    }

    public void setResourceVersionSyncToken(String resourceVersionSyncToken) {
        this.resourceVersionSyncToken = resourceVersionSyncToken;
    }
}
