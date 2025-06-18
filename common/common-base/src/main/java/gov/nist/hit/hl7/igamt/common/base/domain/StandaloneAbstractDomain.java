package gov.nist.hit.hl7.igamt.common.base.domain;

public abstract class StandaloneAbstractDomain extends AbstractDomain {
    private Audience audience;

    public StandaloneAbstractDomain() {
    }

    public StandaloneAbstractDomain(String id, String version, String name, PublicationInfo publicationInfo, DomainInfo domainInfo, String username, String comment, String description) {
        super(id, version, name, publicationInfo, domainInfo, username, comment, description);
    }

    public Audience getAudience() {
        return audience;
    }

    public void setAudience(Audience audience) {
        this.audience = audience;
    }
}
