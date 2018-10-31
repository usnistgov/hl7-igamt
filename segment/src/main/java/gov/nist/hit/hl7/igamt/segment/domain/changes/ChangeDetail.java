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
package gov.nist.hit.hl7.igamt.segment.domain.changes;

/**
 * @author jungyubw
 * @param <T>
 *
 */
public class ChangeDetail {
  private String location; // ID Path : {SegmentId}-{FieldId}-{ComponentId}-{SubComponentId}

  private PropertyType propertyType;
  private PropertyValue<?> propertyValue;
  private StateType stateType;

  private String description; // Just for display
  private String displayLocation; // Display Path: MSH-5.1.1(Identifier)

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

  public StateType getStateType() {
    return stateType;
  }

  public void setStateType(StateType stateType) {
    this.stateType = stateType;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getDisplayLocation() {
    return displayLocation;
  }

  public void setDisplayLocation(String displayLocation) {
    this.displayLocation = displayLocation;
  }

  public PropertyValue<?> getPropertyValue() {
    return propertyValue;
  }

  public void setPropertyValue(PropertyValue<?> propertyValue) {
    this.propertyValue = propertyValue;
  }


}
