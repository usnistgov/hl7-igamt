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
package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.HashSet;
import java.util.Set;
import gov.nist.diff.annotation.DeltaField;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.common.binding.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;

/**
 * @author jungyubw
 *
 */
public class GroupDisplayModel extends SegmentRefOrGroupDisplayModel {
  public GroupDisplayModel() {
    super();
    this.setType(Type.GROUP);
  }

  public GroupDisplayModel(Group group) {
    super();
    this.setType(Type.GROUP);
    this.setCustom(group.isCustom());
    this.setId(group.getId());
    this.setMax(group.getMax());
    this.setMin(group.getMin());
    this.setName(group.getName());
    this.setPosition(group.getPosition());
    this.setText(group.getText());
    this.setUsage(group.getUsage());

  }

  private String idPath;
  private String path;

  @DeltaField
  private Set<BindingDisplay> bindings;

  private ViewScope viewScope;

  public String getIdPath() {
    return idPath;
  }

  public void setIdPath(String idPath) {
    this.idPath = idPath;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public ViewScope getViewScope() {
    return viewScope;
  }

  public void setViewScope(ViewScope viewScope) {
    this.viewScope = viewScope;
  }

  public Set<BindingDisplay> getBindings() {
    return bindings;
  }

  public void setBindings(Set<BindingDisplay> bindings) {
    this.bindings = bindings;
  }

  /**
   * @param createBindingDisplay
   */
  public void addBinding(BindingDisplay binding) {
    if (this.bindings == null) this.bindings = new HashSet<BindingDisplay>();
    this.bindings.add(binding);
  }
}
