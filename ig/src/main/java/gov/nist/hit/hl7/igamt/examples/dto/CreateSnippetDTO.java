package gov.nist.hit.hl7.igamt.examples.dto;

import java.util.List;

public class CreateSnippetDTO {
    private String name;
    private List<String> messageReferences;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getMessageReferences() {
        return messageReferences;
    }

    public void setMessageReferences(List<String> messageReferences) {
        this.messageReferences = messageReferences;
    }
}

