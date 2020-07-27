package gov.nist.hit.hl7.igamt.delta.domain;

import java.util.List;

public class ResourceDelta {
    private List<StructureDelta> structureDelta;
    private List<ConformanceStatementDelta> conformanceStatementDelta;

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
}
