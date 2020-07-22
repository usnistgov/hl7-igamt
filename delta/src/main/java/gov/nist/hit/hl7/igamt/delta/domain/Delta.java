package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;

import java.util.List;

public class Delta<T> {

    private DeltaInfo source;
    private DeltaInfo target;
    private T delta;
    private List<ConformanceStatementDelta> conformanceStatements;
    private List<CoConstraintBinding> coConstraintBindings;


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

    public Delta(DeltaInfo source, DeltaInfo target, T delta, List<ConformanceStatementDelta> conformanceStatements, List<CoConstraintBinding> coConstraintBindings) {
        this.source = source;
        this.target = target;
        this.delta = delta;
        this.conformanceStatements = conformanceStatements;
        this.coConstraintBindings = coConstraintBindings;
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

    public List<CoConstraintBinding> getCoConstraintBindings() {
        return coConstraintBindings;
    }

    public void setCoConstraintBindings(List<CoConstraintBinding> coConstraintBindings) {
        this.coConstraintBindings = coConstraintBindings;
    }
}
