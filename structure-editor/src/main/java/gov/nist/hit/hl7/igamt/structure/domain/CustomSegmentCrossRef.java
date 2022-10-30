package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;

public class CustomSegmentCrossRef {
    DisplayElement element;
    ReferenceLocation location;

    public CustomSegmentCrossRef(DisplayElement element, ReferenceLocation location) {
        this.element = element;
        this.location = location;
    }

    public DisplayElement getElement() {
        return element;
    }

    public void setElement(DisplayElement element) {
        this.element = element;
    }

    public ReferenceLocation getLocation() {
        return location;
    }

    public void setLocation(ReferenceLocation location) {
        this.location = location;
    }
}
