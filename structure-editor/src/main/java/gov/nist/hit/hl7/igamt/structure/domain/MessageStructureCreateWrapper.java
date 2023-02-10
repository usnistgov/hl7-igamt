package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;

import java.util.List;

public class MessageStructureCreateWrapper {
    String structureId;
    String messageType;
    String description;
    String from;
    String version;
    List<MessageEvent> events;

    public String getStructureId() {
        return structureId;
    }

    public void setStructureId(String structureId) {
        this.structureId = structureId;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public List<MessageEvent> getEvents() {
        return events;
    }

    public void setEvents(List<MessageEvent> events) {
        this.events = events;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }


    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

}
