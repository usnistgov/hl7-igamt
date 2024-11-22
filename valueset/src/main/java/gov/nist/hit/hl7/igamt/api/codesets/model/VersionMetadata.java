package gov.nist.hit.hl7.igamt.api.codesets.model;

import java.util.Date;

public class VersionMetadata {

    private String version;
    private Date date;

    public VersionMetadata() {
    }

    public VersionMetadata(String version, Date date) {
        this.version = version;
        this.date = date;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}