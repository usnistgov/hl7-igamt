package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;

public class Permutation {
	
	public enum PermutationTarget {
		Group, Segment, Field, Component
	}
	
	private String name;
	private int position;
	private PermutationTarget target;
	private Set<ItemProperty> items;
	protected List<Permutation> permutations;
	
	public Permutation(String name, int position, PermutationTarget target, Set<ItemProperty> items,
			List<Permutation> permutation) {
		super();
		this.name = name;
		this.position = position;
		this.target = target;
		this.items = items;
		this.permutations = permutation;
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public PermutationTarget getTarget() {
		return target;
	}

	public void setTarget(PermutationTarget target) {
		this.target = target;
	}

	public Set<ItemProperty> getItems() {
		return items;
	}

	public void setItems(Set<ItemProperty> items) {
		this.items = items;
	}

	public List<Permutation> getPermutations() {
		return permutations;
	}

	public void setPermutations(List<Permutation> permutations) {
		this.permutations = permutations;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
	
//	// ALL
//	USAGE
//	// Group, Segment, Field
//	CARDINALITY_MIN
//	// Group, Segment, Field
//	CARDINALITY_MAX
//	// ALL
//	NAME
//	// Field, Component
//	LENGTH_MIN
//	// Field, Component
//	LENGTH_MAX
//	// Field, Component
//	CONF_LENGTH
//	// Field, Component
//	DATATYPE
//	// Field, Component
//	VALUESET
//	// Field, Component
//	SINGLECODE
//	// Field, Component
//	CONSTANT_VALUE
//	// Group, Segment, Field, Component
//	PREDICATE
	
//	CONFORMANCE_STATEMENT, DYNAMIC_MAPPING, CO_CONSTRAINTS, DEFINITION_TEXT, COMMENT, REF
	

}
