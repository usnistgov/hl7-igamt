package gov.nist.hit.hl7.igamt.coconstraints.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;


@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CoConstraintGroupBindingContained.class, name = "CONTAINED"),
        @JsonSubTypes.Type(value = CoConstraintGroupBindingRef.class, name = "REF"),
})
public abstract class CoConstraintGroupBinding {
    protected CoConstraintRequirement requirement;
    protected GroupBindingType type;

    public CoConstraintRequirement getRequirement() {
        return requirement;
    }

    public void setRequirement(CoConstraintRequirement requirement) {
        this.requirement = requirement;
    }

    public GroupBindingType getType() {
        return type;
    }

    public void setType(GroupBindingType type) {
        this.type = type;
    }

    public CoConstraintGroupBinding cloneGroup() throws CloneNotSupportedException {
        return (CoConstraintGroupBinding) this.clone();
    }
}
