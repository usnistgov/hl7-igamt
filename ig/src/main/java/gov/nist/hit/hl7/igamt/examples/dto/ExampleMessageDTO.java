package gov.nist.hit.hl7.igamt.examples.dto;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

import java.util.List;

public class ExampleMessageDTO {
    private String id;
    private String name;
    private String description;
    private String message;
    private String narrativeHTML;
    private DisplayElement profile;
    /**
     * Snippet validation results (populated after message save)
     */
    private List<SnippetValidationInfo> snippetValidations;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public List<SnippetValidationInfo> getSnippetValidations() {
        return snippetValidations;
    }

    public void setSnippetValidations(List<SnippetValidationInfo> snippetValidations) {
        this.snippetValidations = snippetValidations;
    }
}
