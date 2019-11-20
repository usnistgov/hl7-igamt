package gov.nist.hit.hl7.igamt.coconstraints.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("REF")
public class CoConstraintGroupBindingRef extends CoConstraintGroupBinding {
    protected String refId;

    public String getRefId() {
        return refId;
    }

    public void setRefId(String refId) {
        this.refId = refId;
    }

    public CoConstraintGroupBindingRef clone() {
        CoConstraintGroupBindingRef clone = new CoConstraintGroupBindingRef();
        clone.setRefId(refId);
        clone.setRequirement(requirement.clone());
        clone.setType(type);
        return clone;
    }
}
