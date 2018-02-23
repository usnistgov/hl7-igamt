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
package gov.nist.hit.hl7.igamt.shared.domain.binding;

import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.Path;

/**
 * @author jungyubw
 *
 */
public class ValuesetBinding {
  private String valuesetId;
  private ValuesetStrength strength;
  private Set<Path> locations;
  
  public ValuesetBinding(String valuesetId, ValuesetStrength strength, Set<Path> locations) {
    super();
    this.valuesetId = valuesetId;
    this.strength = strength;
    this.locations = locations;
  }

  public String getValuesetId() {
    return valuesetId;
  }

  public void setValuesetId(String valuesetId) {
    this.valuesetId = valuesetId;
  }

  public ValuesetStrength getStrength() {
    return strength;
  }

  public void setStrength(ValuesetStrength strength) {
    this.strength = strength;
  }

  public Set<Path> getLocations() {
    return locations;
  }

  public void setLocationIds(Set<Path> locations) {
    this.locations = locations;
  }
  
  
}
