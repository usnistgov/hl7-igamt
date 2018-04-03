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

import java.util.HashSet;
import java.util.Set;

/**
 * @author jungyubw
 *
 */
public class DynamicMappingInfo {

  /*
   * OBX-2
   */
  private String referencePath;

  /*
   * OBX-5
   */
  private String variesDatatypePath;

  private Set<DynamicMappingItem> items;

  public DynamicMappingInfo() {
    super();
  }

  public DynamicMappingInfo(String referencePath, String variesDatatypePath,
      Set<DynamicMappingItem> items) {
    super();
    this.referencePath = referencePath;
    this.variesDatatypePath = variesDatatypePath;
    this.items = items;
  }

  public String getReferencePath() {
    return referencePath;
  }

  public void setReferencePath(String referencePath) {
    this.referencePath = referencePath;
  }

  public String getVariesDatatypePath() {
    return variesDatatypePath;
  }

  public void setVariesDatatypePath(String variesDatatypePath) {
    this.variesDatatypePath = variesDatatypePath;
  }

  public Set<DynamicMappingItem> getItems() {
    return items;
  }

  public void setItems(Set<DynamicMappingItem> items) {
    this.items = items;
  }
  
  public void addItem(DynamicMappingItem item){
    if(this.items == null) this.items = new HashSet<DynamicMappingItem>();
    this.items.add(item);
  }
}
