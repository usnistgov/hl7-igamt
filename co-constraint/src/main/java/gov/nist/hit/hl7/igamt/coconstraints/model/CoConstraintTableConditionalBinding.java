package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Assertion;

public class CoConstraintTableConditionalBinding {
    private Assertion condition;
    private CoConstraintTable value;

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
}
