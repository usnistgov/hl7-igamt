package gov.nist.hit.hl7.igamt.examples.dto;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

public class ExampleMessageDTO {
    private String id;
    private String name;
    private String message;
    private String narrativeHTML;
    private DisplayElement profile;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNarrativeHTML() {
        return narrativeHTML;
    }

    public void setNarrativeHTML(String narrativeHTML) {
        this.narrativeHTML = narrativeHTML;
    }

    public DisplayElement getProfile() {
        return profile;
    }

    public void setProfile(DisplayElement profile) {
        this.profile = profile;
    }
}
