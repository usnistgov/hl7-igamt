package gov.nist.hit.hl7.igamt.delta.domain;

import java.util.List;

public class Delta<T> {

    private DeltaInfo source;
    private DeltaInfo target;
    private T delta;

    public Delta(DeltaInfo source, DeltaInfo target, T delta) {
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

    public T getDelta() {
        return delta;
    }

    public void setDelta(T delta) {
        this.delta = delta;
    }

}
