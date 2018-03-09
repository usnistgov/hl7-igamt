/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.conformanceprofile.domain;

import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.shared.domain.binding.StructureElementBinding;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.Constraint;

/**
 *
 * @author Maxence Lefort on Mar 9, 2018.
 */
public class ConformanceProfile extends Resource {

  private Set<MsgStructElement> children;
  private StructureElementBinding binding;
  private Set<Constraint> constraints;

  public ConformanceProfile(Set<MsgStructElement> children, StructureElementBinding binding,
      Set<Constraint> constraints) {
    super();
    this.children = children;
    this.binding = binding;
    this.constraints = constraints;
  }

  public ConformanceProfile() {
    super();
  }

  public Set<MsgStructElement> getChildren() {
    return children;
  }

  public void setChildren(Set<MsgStructElement> children) {
    this.children = children;
  }

  public StructureElementBinding getBinding() {
    return binding;
  }

  public void setBinding(StructureElementBinding binding) {
    this.binding = binding;
  }

  public Set<Constraint> getConstraints() {
    return constraints;
  }

  public void setConstraints(Set<Constraint> constraints) {
    this.constraints = constraints;
  }

}
