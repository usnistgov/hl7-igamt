package gov.nist.hit.hl7.igamt.examples.dto;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.examples.domain.ExampleMessage;

import java.util.List;

public class ProfileExampleMessages {
    private DisplayElement profile;
    private List<ExampleMessage> exampleMessages;

    public DisplayElement getProfile() {
        return profile;
    }

    public void setProfile(DisplayElement profile) {
        this.profile = profile;
    }

    public List<ExampleMessage> getExampleMessages() {
        return exampleMessages;
    }

    public void setExampleMessages(List<ExampleMessage> exampleMessages) {
        this.exampleMessages = exampleMessages;
    }
}
