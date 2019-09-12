package gov.nist.hit.hl7.igamt.delta.domain;

import java.util.List;

public class Delta {

    private DeltaInfo source;
    private DeltaInfo target;
    private List<StructureDelta> delta;

    public Delta(DeltaInfo source, DeltaInfo target, List<StructureDelta> delta) {
        this.source = source;
        this.target = target;
        this.delta = delta;
    }

    public DeltaInfo getSource() {
        return source;
    }

    public void setSource(DeltaInfo source) {
        this.source = source;
    }

    public DeltaInfo getTarget() {
        return target;
    }

    public void setTarget(DeltaInfo target) {
        this.target = target;
    }

    public List<StructureDelta> getDelta() {
        return delta;
    }

    public void setDelta(List<StructureDelta> delta) {
        this.delta = delta;
    }
}
