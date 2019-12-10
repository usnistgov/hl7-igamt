package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class CoConstraintGroupRegistry extends Registry {

    public CoConstraintGroupRegistry() {
        super();
        this.type = Type.COCONSTRAINTGROUPREGISTRY;
    }
}
