package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;

import java.util.HashMap;
import java.util.Map;

public class IGDelta {

    private Map<String, DeltaAction> messages;
    private Map<String, DeltaAction> datatypes;
    private Map<String, DeltaAction> segments;

    public IGDelta() {
        messages = new HashMap<>();
        datatypes = new HashMap<>();
        segments = new HashMap<>();
    }

    public Map<String, DeltaAction> getMessages() {
        return messages;
    }

    public void setMessages(Map<String, DeltaAction> messages) {
        this.messages = messages;
    }

    public Map<String, DeltaAction> getDatatypes() {
        return datatypes;
    }

    public void setDatatypes(Map<String, DeltaAction> datatypes) {
        this.datatypes = datatypes;
    }

    public Map<String, DeltaAction> getSegments() {
        return segments;
    }

    public void setSegments(Map<String, DeltaAction> segments) {
        this.segments = segments;
    }
}
