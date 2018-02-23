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
package gov.nist.hit.hl7.igamt.shared.domain.binding;

import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.constraint.Predicate;

/**
 * @author jungyubw
 *
 */
public class StructureElementBinding extends Binding {

  private Set<Comment> comments;
  private Set<ValuesetBinding> valuesetBindings;
  private String singleCodeId;
  private Predicate predicate;
  private Set<PredicateCrossRef> predicateCrossRefs;


  public StructureElementBinding(String elementId, Set<StructureElementBinding> children,
      Set<Comment> comments, Set<ValuesetBinding> valuesetBindings, String singleCodeId,
      Predicate predicate, Set<PredicateCrossRef> predicateCrossRefs) {
    super(elementId, children);
    this.comments = comments;
    this.valuesetBindings = valuesetBindings;
    this.singleCodeId = singleCodeId;
    this.predicate = predicate;
    this.predicateCrossRefs = predicateCrossRefs;
  }

  public Set<Comment> getComments() {
    return comments;
  }

  public void setComments(Set<Comment> comments) {
    this.comments = comments;
  }

  public Set<ValuesetBinding> getValuesetBindings() {
    return valuesetBindings;
  }

  public void setValuesetBindings(Set<ValuesetBinding> valuesetBindings) {
    this.valuesetBindings = valuesetBindings;
  }

  public String getSingleCodeId() {
    return singleCodeId;
  }

  public void setSingleCodeId(String singleCodeId) {
    this.singleCodeId = singleCodeId;
  }

  public Predicate getPredicate() {
    return predicate;
  }

  public void setPredicate(Predicate predicate) {
    this.predicate = predicate;
  }

  public Set<PredicateCrossRef> getPredicateCrossRefs() {
    return predicateCrossRefs;
  }

  public void setPredicateCrossRefs(Set<PredicateCrossRef> predicateCrossRefs) {
    this.predicateCrossRefs = predicateCrossRefs;
  }


}
