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
package gov.nist.hit.hl7.igamt.delta.display;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.delta.domain.DeltaNode;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class ProfileComponentLinkDeltaDisplay {

  private int position;
  private DeltaAction delta;
  private DeltaNode<DisplayElement> display;

   public int getPosition() {
    return position;
  }
  public void setPosition(int position) {
    this.position = position;
  }
  public DeltaAction getDelta() {
    return delta;
  }
  public void setDelta(DeltaAction delta) {
    this.delta = delta;
  }
  public DeltaNode<DisplayElement> getDisplay() {
    return display;
  }
  public void setDisplay(DeltaNode<DisplayElement> display) {
    this.display = display;
  }
}
