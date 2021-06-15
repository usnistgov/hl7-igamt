/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;

/**
 *
 * @author Maxence Lefort on Feb 23, 2018.
 */
public class PropertyDynamicMapping extends ItemProperty {

  private ChangeType change;
  private DynamicMappingItem payload;

  public PropertyDynamicMapping(PropertyType propertyKey) {
    super(propertyKey);
  }
  public PropertyDynamicMapping() {
    super(PropertyType.DYNAMICMAPPINGITEM);
  }
  
  public ChangeType getChange() {
    return change;
  }

  public void setChange(ChangeType change) {
    this.change = change;
  }

  public DynamicMappingItem getPayload() {
    return payload;
  }

  public void setPayload(DynamicMappingItem payload) {
    this.payload = payload;
  }


}
