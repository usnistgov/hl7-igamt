package gov.nist.hit.hl7.igamt.coconstraints.model;


import java.util.List;

public class CoConstraintBindingSegment {
    private StructureElementRef segment;
    private String flavorId;
    private String name;
    private List<CoConstraintTableConditionalBinding> tables;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public StructureElementRef getSegment() {
        return segment;
    }

    public void setSegment(StructureElementRef segment) {
        this.segment = segment;
    }

    public String getFlavorId() {
        return flavorId;
    }

    public void setFlavorId(String flavorId) {
        this.flavorId = flavorId;
    }

    public List<CoConstraintTableConditionalBinding> getTables() {
        return tables;
    }

    public void setTables(List<CoConstraintTableConditionalBinding> tables) {
        this.tables = tables;
    }
}
