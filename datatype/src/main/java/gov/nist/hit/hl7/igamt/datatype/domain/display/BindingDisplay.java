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

import java.util.Set;
import gov.nist.diff.annotation.DeltaField;
import gov.nist.diff.annotation.DeltaIdentity;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ViewScope;

/**
 * @author jungyubw
 *
 */
public class BindingDisplay {

  @DeltaField
  private ViewScope sourceType;
  private String sourceId;
  @DeltaIdentity
  private int priority;
  @DeltaField
  private Set<Comment> comments;
  @DeltaField
  private Set<DisplayValuesetBinding> valuesetBindings;
  @DeltaField
  private InternalSingleCode internalSingleCode;
  @DeltaField
  private ExternalSingleCode externalSingleCode;
  @DeltaField
  private String constantValue;
  @DeltaField
  private Predicate predicate;

  public Set<Comment> getComments() {
    return comments;
  }

  public void setComments(Set<Comment> comments) {
    this.comments = comments;
  }

  public Set<DisplayValuesetBinding> getValuesetBindings() {
    return valuesetBindings;
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

  public ExternalSingleCode getExternalSingleCode() {
    return externalSingleCode;
  }

  public void setExternalSingleCode(ExternalSingleCode externalSingleCode) {
    this.externalSingleCode = externalSingleCode;
  }

  public String getConstantValue() {
    return constantValue;
  }

  public void setConstantValue(String constantValue) {
    this.constantValue = constantValue;
  }

  public Predicate getPredicate() {
    return predicate;
  }

  public void setPredicate(Predicate predicate) {
    this.predicate = predicate;
  }

  public String getSourceId() {
    return sourceId;
  }

  public void setSourceId(String sourceId) {
    this.sourceId = sourceId;
  }

  public ViewScope getSourceType() {
    return sourceType;
  }

  public void setSourceType(ViewScope sourceType) {
    this.sourceType = sourceType;
  }

  public int getPriority() {
    return priority;
  }

  public void setPriority(int priority) {
    this.priority = priority;
  }
}
