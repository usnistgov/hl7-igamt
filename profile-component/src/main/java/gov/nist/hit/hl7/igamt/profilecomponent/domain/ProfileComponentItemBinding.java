package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;

import java.util.Set;

public class ProfileComponentItemBinding {
    private String path;
    private Set<PropertyBinding> bindings;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Set<PropertyBinding> getBindings() {
        return bindings;
    }

    public void setBindings(Set<PropertyBinding> bindings) {
        this.bindings = bindings;
    }
}
