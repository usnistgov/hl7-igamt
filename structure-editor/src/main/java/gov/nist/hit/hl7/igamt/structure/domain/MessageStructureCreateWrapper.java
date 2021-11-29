package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;

import java.util.List;

public class MessageStructureCreateWrapper {
    String name;
    String description;
    String from;
    String version;
    List<Event> events;

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

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public List<Event> getEvents() {
        return events;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }
}
