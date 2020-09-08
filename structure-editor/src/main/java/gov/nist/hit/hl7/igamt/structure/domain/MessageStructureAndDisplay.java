package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;

public class MessageStructureAndDisplay {
    MessageStructure structure;
    DisplayElement displayElement;

    public MessageStructure getStructure() {
        return structure;
    }

    public void setStructure(MessageStructure structure) {
        this.structure = structure;
    }

    public DisplayElement getDisplayElement() {
        return displayElement;
    }

    public void setDisplayElement(DisplayElement displayElement) {
        this.displayElement = displayElement;
    }
}
