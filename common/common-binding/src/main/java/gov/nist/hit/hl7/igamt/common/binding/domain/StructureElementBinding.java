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
package gov.nist.hit.hl7.igamt.common.binding.domain;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;


/**
 * @author jungyubw
 *
 */
public class StructureElementBinding extends Binding {
  private Set<ValuesetBinding> valuesetBindings;
  private InternalSingleCode internalSingleCode;
  private ExternalSingleCode externalSingleCode;
  private Predicate predicate;
  @Deprecated
  private String predicateId;

  private Map<PropertyType, ChangeReason> changeLog;

  public StructureElementBinding() {
    super();
  }

  public Set<ValuesetBinding> getValuesetBindings() {
    return valuesetBindings;
  }
  public void setValuesetBindings(Set<ValuesetBinding> valuesetBindings) {
    this.valuesetBindings = valuesetBindings;
  }

  public void addValuesetBinding(ValuesetBinding newValuesetBinding) {
    if (this.valuesetBindings == null)
      this.valuesetBindings = new HashSet<ValuesetBinding>();
    this.valuesetBindings.add(newValuesetBinding);
  }

  public Map<PropertyType, ChangeReason> getChangeLog() {
    return changeLog;
  }

  public void setChangeLog(Map<PropertyType, ChangeReason> changeLog) {
    this.changeLog = changeLog;
  }

  public ExternalSingleCode getExternalSingleCode() {
    return externalSingleCode;
  }

  public void setExternalSingleCode(ExternalSingleCode externalSingleCode) {
    this.externalSingleCode = externalSingleCode;
  }

  public InternalSingleCode getInternalSingleCode() {
    return internalSingleCode;
  }

  public void setInternalSingleCode(InternalSingleCode internalSingleCode) {
    this.internalSingleCode = internalSingleCode;
  }
  
  public Predicate getPredicate() {
	return predicate;
  }
  
  public void setPredicate(Predicate predicate) {
	this.predicate = predicate;
  }
  @Deprecated
  public String getPredicateId() {
	return predicateId;
  }
  
  @Deprecated
  public void setPredicateId(String predicateId) {
	this.predicateId = predicateId;
  }

@Override
public String toString() {
	return "StructureElementBinding [valuesetBindings=" + valuesetBindings + ", internalSingleCode="
			+ internalSingleCode + ", externalSingleCode=" + externalSingleCode + ", predicate=" + predicate
			+ ", predicateId=" + predicateId + ", elementId=" + elementId + ", locationInfo=" + locationInfo
			+ ", children=" + children + "]";
}


  
  
}
