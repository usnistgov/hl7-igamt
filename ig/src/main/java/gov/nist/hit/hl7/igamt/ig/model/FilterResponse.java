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
package gov.nist.hit.hl7.igamt.ig.model;

import java.util.Set;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class FilterResponse {

  Set<String> conformanceProfiles;
  Set<String> segments;
  Set<String> datatypes;
  Set<String> valueSets;
  Set<String> coConstraintGroup;
  public Set<String> getConformanceProfiles() {
    return conformanceProfiles;
  }
  public void setConformanceProfiles(Set<String> conformanceProfiles) {
    this.conformanceProfiles = conformanceProfiles;
  }
  public Set<String> getSegments() {
    return segments;
  }
  public void setSegments(Set<String> segments) {
    this.segments = segments;
  }
  public Set<String> getDatatypes() {
    return datatypes;
  }
  public void setDatatypes(Set<String> datatypes) {
    this.datatypes = datatypes;
  }
  public Set<String> getValueSets() {
    return valueSets;
  }
  public void setValueSets(Set<String> valueSets) {
    this.valueSets = valueSets;
  }
  public Set<String> getCoConstraintGroup() {
    return coConstraintGroup;
  }
  public void setCoConstraintGroup(Set<String> coConstraintGroup) {
    this.coConstraintGroup = coConstraintGroup;
  }

}
