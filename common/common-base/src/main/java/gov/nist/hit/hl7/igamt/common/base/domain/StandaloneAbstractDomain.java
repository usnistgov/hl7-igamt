package gov.nist.hit.hl7.igamt.common.base.domain;

public abstract class StandaloneAbstractDomain extends AbstractDomain {
    private Audience audience;

    public Audience getAudience() {
        return audience;
    }

    public void setAudience(Audience audience) {
        this.audience = audience;
    }
}
