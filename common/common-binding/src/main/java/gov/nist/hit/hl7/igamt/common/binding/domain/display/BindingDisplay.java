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
package gov.nist.hit.hl7.igamt.common.binding.domain.display;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.common.binding.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.constraint.domain.Predicate;

/**
 * @author jungyubw
 *
 */
public class BindingDisplay {
  private ViewScope sourceType;
  private String sourceId;
  private int priority;
  private Set<Comment> comments;
  private Set<DisplayValuesetBinding> valuesetBindings;
  private InternalSingleCode internalSingleCode;
  private ExternalSingleCode externalSingleCode;
  private String constantValue;
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