package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;

public class DeltaInfo {

    private SourceDocument document;
    private DomainInfo domainInfo;
    private String name;
    private String ext;
    private String description;
    private String id;

    public DeltaInfo(SourceDocument document, DomainInfo domainInfo, String name, String ext, String description, String id) {
        this.document = document;
        this.domainInfo = domainInfo;
        this.name = name;
        this.ext = ext;
        this.description = description;
        this.id = id;
    }

    public DomainInfo getDomainInfo() {
        return domainInfo;
    }

    public void setDomainInfo(DomainInfo domainInfo) {
        this.domainInfo = domainInfo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExt() {
        return ext;
    }

    public void setExt(String ext) {
        this.ext = ext;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public SourceDocument getDocument() {
        return document;
    }

    public void setDocument(SourceDocument document) {
        this.document = document;
    }
}
