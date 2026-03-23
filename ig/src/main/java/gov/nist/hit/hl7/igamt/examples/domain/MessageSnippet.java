package gov.nist.hit.hl7.igamt.examples.domain;

import java.util.HashSet;
import java.util.Set;

public class MessageSnippet {
    private String id;
    private String name;
    private Set<String> messageReferences;
    private String narrativeHTML;

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

    public Set<String> getMessageReferences() {
        if(messageReferences == null) {
            this.messageReferences = new HashSet<>();
        }
        return messageReferences;
    }

    public void setMessageReferences(Set<String> messageReferences) {
        this.messageReferences = messageReferences;
    }

    public String getNarrativeHTML() {
        return narrativeHTML;
    }

    public void setNarrativeHTML(String narrativeHTML) {
        this.narrativeHTML = narrativeHTML;
    }
}
