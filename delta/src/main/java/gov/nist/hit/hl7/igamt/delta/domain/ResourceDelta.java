package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;

import java.util.List;

public class ResourceDelta {
    private List<StructureDelta> structureDelta;
    private List<ConformanceStatementDelta> conformanceStatementDelta;
    private List<CoConstraintBinding> coConstraintBindings;

    public List<StructureDelta> getStructureDelta() {
        return structureDelta;
    }

    public void setStructureDelta(List<StructureDelta> structureDelta) {
        this.structureDelta = structureDelta;
    }

    public List<ConformanceStatementDelta> getConformanceStatementDelta() {
        return conformanceStatementDelta;
    }

    public void setConformanceStatementDelta(List<ConformanceStatementDelta> conformanceStatementDelta) {
        this.conformanceStatementDelta = conformanceStatementDelta;
    }

    public List<CoConstraintBinding> getCoConstraintBindings() {
        return coConstraintBindings;
    }

    public void setCoConstraintBindings(List<CoConstraintBinding> coConstraintBindings) {
        this.coConstraintBindings = coConstraintBindings;
    }
}
