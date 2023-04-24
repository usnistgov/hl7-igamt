package gov.nist.hit.hl7.igamt.access.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Audience;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

import java.util.Date;
import java.util.List;

public class DocumentAccessInfo {
    private String username;
    private List<String> sharedUsers;
    private Status status;
    private Audience audience;
    private Date updateDate;
    private DomainInfo domainInfo;

    public DocumentAccessInfo() {
    }

    public DocumentAccessInfo(Ig ig) {
        this.username = ig.getUsername();
        this.sharedUsers = ig.getSharedUsers();
        this.status = ig.getStatus();
        this.audience = ig.getAudience();
        this.updateDate = ig.getUpdateDate();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getSharedUsers() {
        return sharedUsers;
    }

    public void setSharedUsers(List<String> sharedUsers) {
        this.sharedUsers = sharedUsers;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Audience getAudience() {
        return audience;
    }

    public void setAudience(Audience audience) {
        this.audience = audience;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public DomainInfo getDomainInfo() {
        return domainInfo;
    }

    public void setDomainInfo(DomainInfo domainInfo) {
        this.domainInfo = domainInfo;
    }
}
