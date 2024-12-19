package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDynamicMapping;

import java.util.*;

public class SegmentChangeDirective {
	PropertyDynamicMapping propertyDynamicMapping;
	Set<PropertyBinding> bindings;
	private final Map<String, DatatypeComponentChangeDirective> fields = new HashMap<>();

	public SegmentChangeDirective() {
		super();
	}

	public Set<PropertyBinding> getBindings() {
		return bindings;
	}

	public void setBindings(Set<PropertyBinding> bindings) {
		this.bindings = bindings;
	}

	public PropertyDynamicMapping getPropertyDynamicMapping() {
		return propertyDynamicMapping;
	}

	public void setPropertyDynamicMapping(PropertyDynamicMapping propertyDynamicMapping) {
		this.propertyDynamicMapping = propertyDynamicMapping;
	}

	public Map<String, DatatypeComponentChangeDirective> getFields() {
		return fields;
	}
}
