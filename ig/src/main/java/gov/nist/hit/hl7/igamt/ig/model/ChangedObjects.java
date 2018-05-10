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
package gov.nist.hit.hl7.igamt.ig.model;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ChangedConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ChangedDatatype;
import gov.nist.hit.hl7.igamt.segment.domain.display.ChangedSegment;

/**
 *
 * @author Maxence Lefort on May 1, 2018.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChangedObjects implements Serializable {

  /**
   * 
   */
  private static final long serialVersionUID = 6170223697898010975L;
  private String igDocumentId;
  private List<ChangedSegment> segments;
  private List<ChangedDatatype> datatypes;
  private List<ChangedConformanceProfile> conformanceProfiles;

  public ChangedObjects() {}

  public String getIgDocumentId() {
    return igDocumentId;
  }

  public void setIgDocumentId(String igDocumentId) {
    this.igDocumentId = igDocumentId;
  }
  
  public List<ChangedSegment> getSegments() {
    return segments;
  }

  public void setSegments(List<ChangedSegment> segments) {
    this.segments = segments;
  }
  
  public List<ChangedDatatype> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(List<ChangedDatatype> datatypes) {
    this.datatypes = datatypes;
  }

  public List<ChangedConformanceProfile> getConformanceProfiles() {
    return conformanceProfiles;
  }

  public void setConformanceProfiles(List<ChangedConformanceProfile> conformanceProfiles) {
    this.conformanceProfiles = conformanceProfiles;
  }

}
