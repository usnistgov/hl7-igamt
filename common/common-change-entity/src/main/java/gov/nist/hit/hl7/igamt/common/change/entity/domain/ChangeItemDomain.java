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
package gov.nist.hit.hl7.igamt.common.change.entity.domain;

/**
 * @author jungyubw
 *
 */
public class ChangeItemDomain implements Comparable<ChangeItemDomain> {

  private String location; // FieldId or FieldId-ComponentId
  private PropertyType propertyType;
  private Object propertyValue;
  private Object oldPropertyValue;
  private ChangeType changeType;
  private int position;

  public ChangeItemDomain() {
    super();
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public PropertyType getPropertyType() {
    return propertyType;
  }

  public void setPropertyType(PropertyType propertyType) {
    this.propertyType = propertyType;
  }

  public Object getPropertyValue() {
    return propertyValue;
  }

  public void setPropertyValue(Object propertyValue) {
    this.propertyValue = propertyValue;
  }

  public Object getOldPropertyValue() {
    return oldPropertyValue;
  }

  public void setOldPropertyValue(Object oldPropertyValue) {
    this.oldPropertyValue = oldPropertyValue;
  }

  public ChangeType getChangeType() {
    return changeType;
  }

  public void setChangeType(ChangeType changeType) {
    this.changeType = changeType;
  }



  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public ChangeItemDomain(String location, PropertyType propertyType, Object propertyValue,
      Object oldPropertyValue, ChangeType changeType, int position) {
    super();
    this.location = location;
    this.propertyType = propertyType;
    this.propertyValue = propertyValue;
    this.oldPropertyValue = oldPropertyValue;
    this.changeType = changeType;
    this.position = position;
  }



  /*
   * (non-Javadoc)
   * 
   * @see java.lang.Comparable#compareTo(java.lang.Object)
   */
  @Override
  public int compareTo(ChangeItemDomain o) {
    // TODO Auto-generated method stub
    return this.getPosition() - o.getPosition();
  }

  @Override
  public String toString() {
    return "ChangeItemDomain [location=" + location + ", propertyType=" + propertyType
        + ", propertyValue=" + propertyValue + ", oldPropertyValue=" + oldPropertyValue
        + ", changeType=" + changeType + ", position=" + position + "]";
  }



}
