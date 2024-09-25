package gov.nist.hit.hl7.igamt.ig.mock.utils;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.SingleCodeBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class BindingMockBuilder<T extends ResourceMockBuilder> {
	private IgMockBuilder ig;
	private T resource;
	private Set<ConformanceStatement> conformanceStatements;
	protected String elementId;
	protected LocationInfo locationInfo;
	protected Set<StructureElementBinding> children = new HashSet<>();

	public BindingMockBuilder(IgMockBuilder ig, T resource) {
		this.ig = ig;
		this.resource = resource;
	}

	public BindingMockBuilder() {
	}

	public BindingMockBuilder addValueSetBinding(String path, ValuesetBinding binding) {
		StructureElementBinding elementBinding = find(path);
		if(elementBinding.getValuesetBindings() == null) {
			elementBinding.setValuesetBindings(new HashSet<>());
		}
		elementBinding.getValuesetBindings().add(binding);
		return this;
	}

	public BindingMockBuilder addSingleCodeBinding(String path, SingleCodeBinding binding) {
		StructureElementBinding elementBinding = find(path);
		if(elementBinding.getSingleCodeBindings() == null) {
			elementBinding.setSingleCodeBindings(new ArrayList<>());
		}
		elementBinding.getSingleCodeBindings().add(binding);
		return this;
	}

	public BindingMockBuilder addPredicate(String path, Predicate predicate) {
		StructureElementBinding elementBinding = find(path);
		elementBinding.setPredicate(predicate);
		return this;
	}

	public BindingMockBuilder addConformanceStatement(ConformanceStatement conformanceStatement) {
		conformanceStatements.add(conformanceStatement);
		return this;
	}

	public T add() throws Exception {
		if(this.resource == null) {
			throw new Exception("This builder is not in a resource context");
		}
		resource.withResourceBinding(this);
		return resource;
	}

	public ResourceBinding build() {
		ResourceBinding binding = new ResourceBinding();
		binding.setConformanceStatements(conformanceStatements);
		binding.setChildren(children);
		return binding;
	}

	private StructureElementBinding find(String path) {
		return find(path, this.children);
	}

	private StructureElementBinding find(String path, Set<StructureElementBinding> elements) {
		if(path.contains("-")) {
			String elementId = path.substring(0, path.indexOf("-"));
			StructureElementBinding elementBinding = findByElementId(elementId, elements);
			if(elementBinding.getChildren() == null) {
				elementBinding.setChildren(new HashSet<>());
			}
			return find(path.substring(elementId.length() + 1), elementBinding.getChildren());
		} else {
			return findByElementId(path, elements);
		}
	}

	private StructureElementBinding findByElementId(String elementId, Set<StructureElementBinding> elements) {
		Optional<StructureElementBinding> forPath = elements.stream().filter((elm) -> elm.getElementId().equals(elementId)).findFirst();
		if(forPath.isPresent()) {
			return forPath.get();
		} else {
			StructureElementBinding binding = new StructureElementBinding();
			binding.setElementId(elementId);
			elements.add(binding);
			return binding;
		}
	}

	protected IgMockBuilder getIg() {
		return ig;
	}

	protected void setIg(IgMockBuilder ig) {
		this.ig = ig;
	}

	protected T getResource() {
		return resource;
	}

	protected void setResource(T resource) {
		this.resource = resource;
	}
}
