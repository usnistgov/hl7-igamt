package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;

public abstract class PropertyBinding extends ItemProperty{
    protected String target;

    public PropertyBinding(PropertyType propertyKey) {
        super(propertyKey);
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }
}
