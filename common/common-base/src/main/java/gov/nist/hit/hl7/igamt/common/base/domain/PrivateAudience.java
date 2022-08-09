package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.Set;

public class PrivateAudience extends Audience {
    private String editor;
    private Set<String> viewers;
    public PrivateAudience() {
        super(AudienceType.PRIVATE);
    }

    public String getEditor() {
        return editor;
    }

    public void setEditor(String editor) {
        this.editor = editor;
    }

    public Set<String> getViewers() {
        return viewers;
    }

    public void setViewers(Set<String> viewers) {
        this.viewers = viewers;
    }
}
