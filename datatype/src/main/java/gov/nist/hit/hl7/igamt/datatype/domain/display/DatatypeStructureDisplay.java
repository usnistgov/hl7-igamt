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

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;

/**
 * @author jungyubw
 *
 */
public class DatatypeStructureDisplay {
  private CompositeKey id;
  private String label;
  private String name;
  private Scope scope;
  private String version;

  private Set<ComponentStructureTreeModel> structure;

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public Set<ComponentStructureTreeModel> getStructure() {
    return structure;
  }

  public void setStructure(Set<ComponentStructureTreeModel> structure) {
    this.structure = structure;
  }

  /**
   * @param fieldDisplayModel
   */
  public void addComponent(ComponentStructureTreeModel componentStructureTreeModel) {
    if (this.structure == null)
      this.structure = new HashSet<ComponentStructureTreeModel>();
    this.structure.add(componentStructureTreeModel);
  }
}
