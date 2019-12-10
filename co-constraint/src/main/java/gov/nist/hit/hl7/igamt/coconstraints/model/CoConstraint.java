package gov.nist.hit.hl7.igamt.coconstraints.model;

import java.util.HashMap;
import java.util.Map;

public class CoConstraint {
    protected String id;
    protected CoConstraintRequirement requirement;
    protected Map<String, CoConstraintCell> cells;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CoConstraintRequirement getRequirement() {
        return requirement;
    }

    public void setRequirement(CoConstraintRequirement requirement) {
        this.requirement = requirement;
    }

    public Map<String, CoConstraintCell> getCells() {
        return cells;
    }

    public void setCells(Map<String, CoConstraintCell> cells) {
        this.cells = cells;
    }

    public CoConstraint clone() throws CloneNotSupportedException{
        CoConstraint row = new CoConstraint();
        row.requirement = this.requirement.clone();
        Map<String, CoConstraintCell> cells = new HashMap<>();
        for(Map.Entry<String, CoConstraintCell> entry : this.cells.entrySet()){
            cells.put(entry.getKey(), entry.getValue().cloneCell());
        }
        row.cells = cells;
        row.id = id;
        return row;
    }
}
