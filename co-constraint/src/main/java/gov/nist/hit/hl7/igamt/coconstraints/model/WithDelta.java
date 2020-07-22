package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.diff.domain.DeltaAction;

public class WithDelta {
    DeltaAction delta;

    public DeltaAction getDelta() {
        return delta;
    }

    public void setDelta(DeltaAction delta) {
        this.delta = delta;
    }
}
