package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;

import java.util.Set;

public class ProfileComponentBinding {
    private Set<PropertyBinding> contextBindings;
    private Set<ProfileComponentItemBinding> itemBindings;

    public Set<PropertyBinding> getContextBindings() {
        return contextBindings;
    }

    public void setContextBindings(Set<PropertyBinding> contextBindings) {
        this.contextBindings = contextBindings;
    }

    public Set<ProfileComponentItemBinding> getItemBindings() {
        return itemBindings;
    }

    public void setItemBindings(Set<ProfileComponentItemBinding> itemBindings) {
        this.itemBindings = itemBindings;
    }
}
