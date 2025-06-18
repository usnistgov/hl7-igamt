package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;

import java.util.*;

public class DatatypeChangeDirective {
	private Set<PropertyBinding> bindings;
	private final Map<String, DatatypeComponentChangeDirective> components = new HashMap<>();

	public DatatypeChangeDirective() {
		super();
	}

	public Set<PropertyBinding> getBindings() {
		return bindings;
	}

	public void setBindings(Set<PropertyBinding> bindings) {
		this.bindings = bindings;
	}

	public Map<String, DatatypeComponentChangeDirective> getComponents() {
		return components;
	}
}
