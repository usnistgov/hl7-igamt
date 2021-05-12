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
package gov.nist.hit.hl7.igamt.datatype.domain.display;

import java.util.Map;
import java.util.Set;

import gov.nist.diff.annotation.DeltaField;
import gov.nist.hit.hl7.igamt.common.binding.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ViewScope;

/**
 * @author jungyubw
 *
 */
public class BindingDisplay {
	@DeltaField
	private Predicate predicate;

	@DeltaField
	private ViewScope predicateSourceType;

	@DeltaField
	private String predicateSourceId;

	@DeltaField
	private Integer predicatePriority;

	@DeltaField
	private Set<DisplayValuesetBinding> valuesetBindings;

	@DeltaField
	private ViewScope valuesetBindingsSourceType;

	@DeltaField
	private String valuesetBindingsSourceId;

	@DeltaField
	private Integer valuesetBindingsPriority;
	
	@DeltaField
	private InternalSingleCode internalSingleCode;
	
	@DeltaField
	private BindingType bindingType;

	private Map<PropertyType, ChangeReason> changeLog;

	public Set<DisplayValuesetBinding> getValuesetBindings() {
		return valuesetBindings;
	}

	public Predicate getPredicate() {
		return predicate;
	}

	public void setPredicate(Predicate predicate) {
		this.predicate = predicate;
	}

	public ViewScope getPredicateSourceType() {
		return predicateSourceType;
	}

	public void setPredicateSourceType(ViewScope predicateSourceType) {
		this.predicateSourceType = predicateSourceType;
	}

	public ViewScope getValuesetBindingsSourceType() {
		return valuesetBindingsSourceType;
	}

	public void setValuesetBindingsSourceType(ViewScope valuesetBindingsSourceType) {
		this.valuesetBindingsSourceType = valuesetBindingsSourceType;
	}

	public String getPredicateSourceId() {
		return predicateSourceId;
	}

	public void setPredicateSourceId(String predicateSourceId) {
		this.predicateSourceId = predicateSourceId;
	}

	public Integer getPredicatePriority() {
		return predicatePriority;
	}

	public void setPredicatePriority(Integer predicatePriority) {
		this.predicatePriority = predicatePriority;
	}

	public String getValuesetBindingsSourceId() {
		return valuesetBindingsSourceId;
	}

	public void setValuesetBindingsSourceId(String valuesetBindingsSourceId) {
		this.valuesetBindingsSourceId = valuesetBindingsSourceId;
	}

	public Integer getValuesetBindingsPriority() {
		return valuesetBindingsPriority;
	}

	public void setValuesetBindingsPriority(Integer valuesetBindingsPriority) {
		this.valuesetBindingsPriority = valuesetBindingsPriority;
	}

	public void setValuesetBindings(Set<DisplayValuesetBinding> valuesetBindings) {
		this.valuesetBindings = valuesetBindings;
	}

	public InternalSingleCode getInternalSingleCode() {
		return internalSingleCode;
	}

	public void setInternalSingleCode(InternalSingleCode internalSingleCode) {
		this.internalSingleCode = internalSingleCode;
	}

	public BindingType getBindingType() {
		return bindingType;
	}

	public void setBindingType(BindingType bindingType) {
		this.bindingType = bindingType;
	}

	public Map<PropertyType, ChangeReason> getChangeLog() {
		return changeLog;
	}

	public void setChangeLog(Map<PropertyType, ChangeReason> changeLog) {
		this.changeLog = changeLog;
	}
}
