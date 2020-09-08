package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;

import java.util.List;

public class MessageStructureMetadata {
    private String structId;
    private String messageType;
    private String description;
    private List<Event> events;

    public String getStructId() {
        return structId;
    }

    public void setStructId(String structId) {
        this.structId = structId;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }
}
