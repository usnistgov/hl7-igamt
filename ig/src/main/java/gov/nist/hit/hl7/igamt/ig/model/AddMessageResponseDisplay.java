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

import java.util.ArrayList;
import java.util.List;

import gov.nist.hit.hl7.igamt.display.model.DisplayElement;

/**
 * @author ena3
 *
 */
public class AddMessageResponseDisplay {
	
  List<DisplayElement> conformanceProfiles = new ArrayList<DisplayElement>();
  List<DisplayElement> datatypes = new ArrayList<DisplayElement>();
  List<DisplayElement> segments = new ArrayList<DisplayElement>();
  List<DisplayElement> valueSets = new ArrayList<DisplayElement>();

  public List<DisplayElement> getConformanceProfiles() {
    return conformanceProfiles;
  }

  public void setConformanceProfiles(List<DisplayElement> conformanceProfiles) {
    this.conformanceProfiles = conformanceProfiles;
  }

  public List<DisplayElement> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(List<DisplayElement> datatypes) {
    this.datatypes = datatypes;
  }

  public List<DisplayElement> getSegments() {
    return segments;
  }

  public void setSegments(List<DisplayElement> segments) {
    this.segments = segments;
  }

  public List<DisplayElement> getValueSets() {
    return valueSets;
  }

  public void setValueSets(List<DisplayElement> valueSets) {
    this.valueSets = valueSets;
  }
}
