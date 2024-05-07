package gov.nist.hit.hl7.igamt.api.codesets.model;

import java.util.Date;

public class VersionMetadata {

    private String version;
    private Date date;
    private int numberOfCodes;

    public VersionMetadata() {
    }

    public VersionMetadata(String version, Date date, int numberOfCodes) {
        this.version = version;
        this.date = date;
        this.numberOfCodes = numberOfCodes;
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

    public int getNumberOfCodes() {
        return numberOfCodes;
    }

    public void setNumberOfCodes(int numberOfCodes) {
        this.numberOfCodes = numberOfCodes;
    }
}