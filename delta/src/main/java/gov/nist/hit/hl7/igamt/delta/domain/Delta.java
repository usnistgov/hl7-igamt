package gov.nist.hit.hl7.igamt.delta.domain;

import java.util.List;

public class Delta<T> {

    private DeltaInfo source;
    private DeltaInfo target;
    private T delta;
    private List<ConformanceStatementDelta> conformanceStatements;


    public Delta(DeltaInfo source, DeltaInfo target, T delta) {
        this.source = source;
        this.target = target;
        this.delta = delta;
    }

    public Delta(DeltaInfo source, DeltaInfo target, T delta, List<ConformanceStatementDelta> conformanceStatements) {
        this.source = source;
        this.target = target;
        this.delta = delta;
        this.conformanceStatements = conformanceStatements;
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

    public List<ConformanceStatementDelta> getConformanceStatements() {
        return conformanceStatements;
    }

    public void setConformanceStatements(List<ConformanceStatementDelta> conformanceStatements) {
        this.conformanceStatements = conformanceStatements;
    }

}
