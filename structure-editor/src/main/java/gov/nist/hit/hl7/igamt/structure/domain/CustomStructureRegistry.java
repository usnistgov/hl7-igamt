package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

import java.util.List;

public class CustomStructureRegistry {

    List<DisplayElement> messageStructureRegistry;
    List<DisplayElement> segmentStructureRegistry;

    public List<DisplayElement> getMessageStructureRegistry() {
        return messageStructureRegistry;
    }

    public void setMessageStructureRegistry(List<DisplayElement> messageStructureRegistry) {
        this.messageStructureRegistry = messageStructureRegistry;
    }

    public List<DisplayElement> getSegmentStructureRegistry() {
        return segmentStructureRegistry;
    }

    public void setSegmentStructureRegistry(List<DisplayElement> segmentStructureRegistry) {
        this.segmentStructureRegistry = segmentStructureRegistry;
    }
}
