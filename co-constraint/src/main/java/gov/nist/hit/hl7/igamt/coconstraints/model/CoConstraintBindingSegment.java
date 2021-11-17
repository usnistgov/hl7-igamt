package gov.nist.hit.hl7.igamt.coconstraints.model;


import java.util.List;
import java.util.stream.Collectors;

public class CoConstraintBindingSegment extends WithDelta {
    private StructureElementRef segment;
    private String name;
    private DeltaField<String> nameDelta;
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

    public List<CoConstraintTableConditionalBinding> getTables() {
        return tables;
    }

    public void setTables(List<CoConstraintTableConditionalBinding> tables) {
        this.tables = tables;
    }

    public CoConstraintBindingSegment clone() {
        CoConstraintBindingSegment clone = new CoConstraintBindingSegment();
        clone.setSegment(segment);
        clone.setName(name);
        clone.setTables(tables.stream().map(CoConstraintTableConditionalBinding::clone).collect(Collectors.toList()));
        return clone;
    }

    public DeltaField<String> getNameDelta() {
        return nameDelta;
    }

    public void setNameDelta(DeltaField<String> nameDelta) {
        this.nameDelta = nameDelta;
    }
}
