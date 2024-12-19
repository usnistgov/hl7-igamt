package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCoConstraintBindings;

import java.util.*;

public class ConformanceProfileContextChangeDirective extends ResourceChangeDirective {
	private Set<PropertyBinding> bindings;
	private PropertyCoConstraintBindings coConstraints;
	private final Map<String, SegRefOrGroupChangeDirective> children = new HashMap<>();

	public ConformanceProfileContextChangeDirective(DirectiveContextMatchTarget matchTarget, String profileComponentId) {
		super(matchTarget, profileComponentId);
	}

	public Map<String, SegRefOrGroupChangeDirective> getChildren() {
		return children;
	}

	public Set<PropertyBinding> getBindings() {
		return bindings;
	}

	public void setBindings(Set<PropertyBinding> bindings) {
		this.bindings = bindings;
	}

	public PropertyCoConstraintBindings getCoConstraints() {
		return coConstraints;
	}

	public void setCoConstraints(PropertyCoConstraintBindings coConstraints) {
		this.coConstraints = coConstraints;
	}

}
