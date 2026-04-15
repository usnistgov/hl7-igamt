package gov.nist.hit.hl7.igamt.examples.domain;

import java.util.ArrayList;
import java.util.List;

public class ExampleMessage {
    private String id;
    private String name;
    private String description;
    private String message;
    private String narrativeHTML;
    private String profileId;
    private List<MessageSnippet> snippets;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getProfileId() {
        return profileId;
    }

    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }

    public List<MessageSnippet> getSnippets() {
        if(this.snippets == null) {
            this.snippets = new ArrayList<>();
        }
        return snippets;
    }

    public void setSnippets(List<MessageSnippet> snippets) {
        this.snippets = snippets;
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
}
