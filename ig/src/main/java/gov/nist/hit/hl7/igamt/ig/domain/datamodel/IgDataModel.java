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
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;

/**
 * @author jungyubw
 *
 */
public class IgDataModel {
  private Ig model;

  private Set<DatatypeDataModel> datatypes = new HashSet<DatatypeDataModel>();
  private Set<SegmentDataModel> segments = new HashSet<SegmentDataModel>();
  private Set<ConformanceProfileDataModel> conformanceProfiles = new HashSet<ConformanceProfileDataModel>();
  private Set<ValuesetDataModel> valuesets = new HashSet<ValuesetDataModel>();

  public Ig getModel() {
    return model;
  }

  public Set<ConformanceProfileDataModel> getConformanceProfiles() {
	return conformanceProfiles;
}

public void setConformanceProfiles(Set<ConformanceProfileDataModel> conformanceProfiles) {
	this.conformanceProfiles = conformanceProfiles;
}

public Set<ValuesetDataModel> getValuesets() {
	return valuesets;
}

public void setDatatypes(Set<DatatypeDataModel> datatypes) {
	this.datatypes = datatypes;
}

public void setModel(Ig model) {
    this.model = model;
  }

  public Set<DatatypeDataModel> getDatatypes() {
    return datatypes;
  }

   

  public void setValuesets(Set<ValuesetDataModel> valuesets) {
    this.valuesets = valuesets;
  }

public Set<SegmentDataModel> getSegments() {
	return segments;
}

public void setSegments(Set<SegmentDataModel> segments) {
	this.segments = segments;
}



}
