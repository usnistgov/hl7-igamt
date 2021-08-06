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
package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class DynamicMappingItemDelta {


  private DeltaAction action;
  private String datatypeName;
  public DeltaNode<String> flavorId;
  
  public DynamicMappingItemDelta(DeltaAction action, String datatypeName,
      DeltaNode<String> flavorId) {
    super();
    this.action = action;
    this.datatypeName = datatypeName;
    this.flavorId = flavorId;
  }

  public DynamicMappingItemDelta() {
  }

  public DeltaAction getAction() {
    return action;
  }

  public void setAction(DeltaAction action) {
    this.action = action;
  }

  public String getDatatypeName() {
    return datatypeName;
  }

  public void setDatatypeName(String datatypeName) {
    this.datatypeName = datatypeName;
  }

  public DeltaNode<String> getFlavorId() {
    return flavorId;
  }

  public void setFlavorId(DeltaNode<String> flavorId) {
    this.flavorId = flavorId;
  }

  public void crunchAction(DeltaAction a) {
    if(a != DeltaAction.UNCHANGED) {
      this.setAction(DeltaAction.UPDATED);
    }
  }

}
