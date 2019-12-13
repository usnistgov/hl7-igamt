package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Ref;

public class DatatypeCell extends CoConstraintCell {
    protected String value;
    protected String datatypeId;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDatatypeId() {
        return datatypeId;
    }

    public void setDatatypeId(String datatypeId) {
        this.datatypeId = datatypeId;
    }

    public DatatypeCell clone() {
        DatatypeCell datatypeCell = new DatatypeCell();
        datatypeCell.setValue(value);
        datatypeCell.setDatatypeId(datatypeId);
        return datatypeCell;
    }
}
