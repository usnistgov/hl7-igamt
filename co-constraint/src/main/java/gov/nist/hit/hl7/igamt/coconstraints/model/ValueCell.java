package gov.nist.hit.hl7.igamt.coconstraints.model;

public class ValueCell extends CoConstraintCell {
    protected String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public ValueCell clone() {
        ValueCell clone = new ValueCell();
        clone.setType(type);
        clone.setValue(value);
        return clone;
    }
}
