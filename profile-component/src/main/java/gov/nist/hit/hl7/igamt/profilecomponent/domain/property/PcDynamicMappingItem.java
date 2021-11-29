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
package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class PcDynamicMappingItem {

  private ChangeType change;
  private String datatypeName;
  private String flavorId;


  public PcDynamicMappingItem() {
    super();
  }
  public PcDynamicMappingItem(ChangeType change, String datatypeName, String flavorId) {
    super();
    this.change = change;
    this.datatypeName = datatypeName;
    this.flavorId = flavorId;
  }
  public ChangeType getChange() {
    return change;
  }
  public void setChange(ChangeType change) {
    this.change = change;
  }
  public String getDatatypeName() {
    return datatypeName;
  }
  public void setDatatypeName(String datatypeName) {
    this.datatypeName = datatypeName;
  }
  public String getFlavorId() {
    return flavorId;
  }
  public void setFlavorId(String flavorId) {
    this.flavorId = flavorId;
  }


}
