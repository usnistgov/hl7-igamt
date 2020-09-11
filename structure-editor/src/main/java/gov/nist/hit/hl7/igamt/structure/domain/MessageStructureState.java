package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;

import java.util.List;
import java.util.Set;

public class MessageStructureState {
    MessageStructure structure;
    Set<Resource> resources;
    List<DisplayElement> datatypes;
    List<DisplayElement> segments;
    List<DisplayElement> valuesets;

    public MessageStructure getStructure() {
        return structure;
    }

    public void setStructure(MessageStructure structure) {
        this.structure = structure;
    }

    public Set<Resource> getResources() {
        return resources;
    }

    public void setResources(Set<Resource> resources) {
        this.resources = resources;
    }

    public List<DisplayElement> getDatatypes() {
        return datatypes;
    }

    public void setDatatypes(List<DisplayElement> datatypes) {
        this.datatypes = datatypes;
    }

    public List<DisplayElement> getSegments() {
        return segments;
    }

    public void setSegments(List<DisplayElement> segments) {
        this.segments = segments;
    }

    public List<DisplayElement> getValuesets() {
        return valuesets;
    }

    public void setValuesets(List<DisplayElement> valuesets) {
        this.valuesets = valuesets;
    }
}
