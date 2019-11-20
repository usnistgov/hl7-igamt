package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.display.model.DisplayElement;

public class CoConstraintGroupCreateResponse {
    private String id;
    private Registry registry;
    private DisplayElement display;

    public CoConstraintGroupCreateResponse(String id, Registry registry, DisplayElement display) {
        this.id = id;
        this.registry = registry;
        this.display = display;
    }

    public CoConstraintGroupCreateResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Registry getRegistry() {
        return registry;
    }

    public void setRegistry(Registry registry) {
        this.registry = registry;
    }

    public DisplayElement getDisplay() {
        return display;
    }

    public void setDisplay(DisplayElement display) {
        this.display = display;
    }
}
