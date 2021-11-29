package gov.nist.hit.hl7.igamt.structure.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class MessageStructureRegistry extends Registry {

    MessageStructureRegistry() {
        super();
        this.type = Type.MESSAGESTRUCTUREREGISTRY;
    }

}
