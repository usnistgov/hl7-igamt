package gov.nist.hit.hl7.igamt.ig.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Status;

import java.util.List;

public class IgEditMetadata {

    private String coverPicture;
    private String title;
    private String subTitle;
    private String version;
    private String organization;
    private List<String> authors;
    private List<String> hl7Versions;
    private Status status;
    private String implementationNotes;

    public String getCoverPicture() {
        return coverPicture;
    }

    public void setCoverPicture(String coverPicture) {
        this.coverPicture = coverPicture;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubTitle() {
        return subTitle;
    }

    public void setSubTitle(String subTitle) {
        this.subTitle = subTitle;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public List<String> getAuthors() {
        return authors;
    }

    public void setAuthors(List<String> authors) {
        this.authors = authors;
    }

    public List<String> getHl7Versions() {
        return hl7Versions;
    }

    public void setHl7Versions(List<String> hl7Versions) {
        this.hl7Versions = hl7Versions;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getImplementationNotes() {
        return implementationNotes;
    }

    public void setImplementationNotes(String implementationNotes) {
        this.implementationNotes = implementationNotes;
    }
}
