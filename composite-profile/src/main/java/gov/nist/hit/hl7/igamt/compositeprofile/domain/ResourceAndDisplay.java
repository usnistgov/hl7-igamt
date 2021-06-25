package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

public class ResourceAndDisplay<T extends Resource> {
    DisplayElement display;
    T resource;

    public ResourceAndDisplay(DisplayElement display, T resource) {
        this.display = display;
        this.resource = resource;
    }

    public ResourceAndDisplay() {
    }

    public DisplayElement getDisplay() {
        return display;
    }

    public void setDisplay(DisplayElement display) {
        this.display = display;
    }

    public T getResource() {
        return resource;
    }

    public void setResource(T resource) {
        this.resource = resource;
    }
}
