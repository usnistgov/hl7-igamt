package gov.nist.hit.hl7.igamt.coconstraints.model;

public class NarrativeHeader extends CoConstraintHeader {
    protected String title;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public NarrativeHeader clone() {
        NarrativeHeader narrativeHeader = new NarrativeHeader();
        narrativeHeader.setTitle(title);
        narrativeHeader.setKey(key);
        narrativeHeader.setType(type);
        return narrativeHeader;
    }
}
