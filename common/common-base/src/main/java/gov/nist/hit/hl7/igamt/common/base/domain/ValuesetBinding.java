/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import gov.nist.diff.annotation.DeltaField;
import gov.nist.diff.annotation.DeltaIdentity;

/**
 * @author jungyubw
 *
 */
public class ValuesetBinding implements Serializable{
	@DeltaIdentity
	private List<String> valueSets;
	@DeltaField
	private ValuesetStrength strength;
	@DeltaField
	private Set<Integer> valuesetLocations = new HashSet<Integer>();

	public ValuesetBinding() {
		super();
	}

	public ValuesetStrength getStrength() {
		return strength;
	}

	public void setStrength(ValuesetStrength strength) {
		this.strength = strength;
	}

	public Set<Integer> getValuesetLocations() {
		return valuesetLocations;
	}

	public void setValuesetLocations(Set<Integer> valuesetLocations) {
		this.valuesetLocations = valuesetLocations;
	}

	public void addValuesetLocation(Integer location) {
		this.valuesetLocations.add(location);
	}

	@Override
	public String toString() {
		return "ValuesetBinding [valuesetId=" + valueSets.toString() + ", strength=" + strength
				+ ", valuesetLocations=" + valuesetLocations + "]";
	}

	public List<String> getValueSets() {
		return valueSets;
	}

	public void setValueSets(List<String> valueSets) {
		this.valueSets = valueSets;
	}

	public ValuesetBinding clone() {
		ValuesetBinding clone = new ValuesetBinding();
		clone.setValueSets(new ArrayList<>(this.valueSets));
		clone.setStrength(strength);
		clone.setValuesetLocations(new HashSet<>(valuesetLocations));
		return clone;
	}

}
