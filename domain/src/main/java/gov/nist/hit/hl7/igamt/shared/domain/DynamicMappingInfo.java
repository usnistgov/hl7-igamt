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
package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.Path;

/**
 * @author jungyubw
 *
 */
public class DynamicMappingInfo {

  /*
   * OBX-2
   */
  private Path referencePath;

  /*
   * OBX-5
   */
  private Path variesDatatypePath;

  private Set<DynamicMappingItem> items;

  public DynamicMappingInfo(Path referencePath, Path variesDatatypePath,
      Set<DynamicMappingItem> items) {
    super();
    this.referencePath = referencePath;
    this.variesDatatypePath = variesDatatypePath;
    this.items = items;
  }

  public Path getReferencePath() {
    return referencePath;
  }

  public void setReferencePath(Path referencePath) {
    this.referencePath = referencePath;
  }

  public Path getVariesDatatypePath() {
    return variesDatatypePath;
  }

  public void setVariesDatatypePath(Path variesDatatypePath) {
    this.variesDatatypePath = variesDatatypePath;
  }

  public Set<DynamicMappingItem> getItems() {
    return items;
  }

  public void setItems(Set<DynamicMappingItem> items) {
    this.items = items;
  }



}
