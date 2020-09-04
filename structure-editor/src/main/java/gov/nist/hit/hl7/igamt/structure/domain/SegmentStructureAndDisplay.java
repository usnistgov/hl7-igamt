package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

public class SegmentStructureAndDisplay {
    Segment structure;
    DisplayElement displayElement;

    public Segment getStructure() {
        return structure;
    }

    public void setStructure(Segment structure) {
        this.structure = structure;
    }

    public DisplayElement getDisplayElement() {
        return displayElement;
    }

    public void setDisplayElement(DisplayElement displayElement) {
        this.displayElement = displayElement;
    }
}
