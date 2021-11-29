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
package gov.nist.hit.hl7.igamt.segment.domain;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.valueset.domain.Code;

/**
 * @author jungyubw
 *
 */
public class DynamicMappingInfo {

  /*
   * OBX-2
   */
  private String referenceFieldId;

  /*
   * OBX-5
   */
  private String variesFieldId;

  private Set<DynamicMappingItem> items;
  
  private HashMap<String, String> mapping = new HashMap<>();


  public DynamicMappingInfo() {
    super();
  }

  public DynamicMappingInfo(String referenceFieldId, String variesFieldId,
      Set<DynamicMappingItem> items) {
    super();
    this.referenceFieldId = referenceFieldId;
    this.variesFieldId = variesFieldId;
    this.items = items;
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

  public String getReferenceFieldId() {
    return referenceFieldId;
  }

  public void setReferenceFieldId(String referenceFieldId) {
    this.referenceFieldId = referenceFieldId;
  }

  public String getVariesFieldId() {
    return variesFieldId;
  }

  public void setVariesFieldId(String variesFieldId) {
    this.variesFieldId = variesFieldId;
  }

  public HashMap<String, String> getMapping() {
    return mapping;
  }

  public void setMapping(HashMap<String, String> mapping) {
    this.mapping = mapping;
  }

public boolean contains(Code code) {
	if(this.items != null)
	for(DynamicMappingItem dmi : this.items) {
		if(dmi.getValue().equals(code.getValue())) return true;
	}
	return false;
}
}
