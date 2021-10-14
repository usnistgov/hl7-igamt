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

import java.util.List;

import gov.nist.diff.domain.DeltaAction;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class CompositeProfileDelta {
  private DeltaAction action;
  private List<ProfileComponentLinkDelta> children; 
  private String coreProfileId;
  private String compositeProfileId;
  private DeltaAction profileDeltaAction;
  public DeltaAction getAction() {
    return action;
  }
  public void setAction(DeltaAction action) {
    this.action = action;
  }
  public List<ProfileComponentLinkDelta> getChildren() {
    return children;
  }
  public void setChildren(List<ProfileComponentLinkDelta> children) {
    this.children = children;
  }
  public String getCoreProfileId() {
    return coreProfileId;
  }
  public void setCoreProfileId(String coreProfileId) {
    this.coreProfileId = coreProfileId;
  }
  public DeltaAction getProfileDeltaAction() {
    return profileDeltaAction;
  }
  public void setProfileDeltaAction(DeltaAction profileDeltaAction) {
    this.profileDeltaAction = profileDeltaAction;
  }
  public String getCompositeProfileId() {
    return compositeProfileId;
  }
  public void setCompositeProfileId(String compositeProfileId) {
    this.compositeProfileId = compositeProfileId;
  }
 
  
}
