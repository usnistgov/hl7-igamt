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

import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.segment.domain.Field;

/**
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
public class PropertyCardinalityMin extends ItemProperty implements ApplyMsgStructElement, ApplyField{

  private int min;

  public PropertyCardinalityMin(int min) {
    super(PropertyType.CARDINALITYMIN);
    this.min = min;
  }

  public PropertyCardinalityMin() {
    super(PropertyType.CARDINALITYMIN);
  }

  public int getMin() {
    return min;
  }

  public void setMin(int min) {
    this.min = min;
  }

  @Override
  public void onField(Field elm) {
    elm.setMin(min);
  }

  @Override
  public void onMsgStructElement(MsgStructElement elm) {
    elm.setMin(min);
  }
}
