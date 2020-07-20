package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Assertion;

public class CoConstraintTableConditionalBinding extends WithDelta {
    private Assertion condition;
    private CoConstraintTable value;
    private DeltaField<String> conditionDelta;

    public Assertion getCondition() {
        return condition;
    }

    public void setCondition(Assertion condition) {
        this.condition = condition;
    }

    public CoConstraintTable getValue() {
        return value;
    }

    public void setValue(CoConstraintTable value) {
        this.value = value;
    }

    public DeltaField<String> getConditionDelta() {
        return conditionDelta;
    }

    public void setConditionDelta(DeltaField<String> conditionDelta) {
        this.conditionDelta = conditionDelta;
    }

    public CoConstraintTableConditionalBinding clone() {
        CoConstraintTableConditionalBinding table = new CoConstraintTableConditionalBinding();
        table.setCondition(condition);
        table.setValue(value.clone());
        return table;
    }
}
