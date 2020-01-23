package gov.nist.hit.hl7.igamt.coconstraints.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

import java.util.ArrayList;
import java.util.List;

@JsonTypeName("CONTAINED")
public class CoConstraintGroupBindingContained extends  CoConstraintGroupBinding {
    protected String name;
    protected List<CoConstraint> coConstraints;
    
    public CoConstraintGroupBindingContained() {
    	this.type = GroupBindingType.CONTAINED;
    }
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CoConstraint> getCoConstraints() {
        return coConstraints;
    }

    public void setCoConstraints(List<CoConstraint> coConstraints) {
        this.coConstraints = coConstraints;
    }

    public CoConstraintGroupBindingContained clone() {
        CoConstraintGroupBindingContained clone = new CoConstraintGroupBindingContained();
        clone.setName(name);
        clone.setRequirement(requirement.clone());
        clone.setType(type);
        clone.setCoConstraints(new ArrayList<>(coConstraints));
        return clone;
    }
}
