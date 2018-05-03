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

import java.util.List;

/**
 *
 * @author Maxence Lefort on May 1, 2018.
 */
public class ChangedObjects {

  private String igDocumentId;
  private List<ChangedObject> segments;
  private List<ChangedObject> datatypes;
  private List<ChangedObject> valuesets;

  public ChangedObjects() {}

  public String getIgDocumentId() {
    return igDocumentId;
  }

  public void setIgDocumentId(String igDocumentId) {
    this.igDocumentId = igDocumentId;
  }

  public List<ChangedObject> getSegments() {
    return segments;
  }

  public void setSegments(List<ChangedObject> segments) {
    this.segments = segments;
  }

  public List<ChangedObject> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(List<ChangedObject> datatypes) {
    this.datatypes = datatypes;
  }

  public List<ChangedObject> getValuesets() {
    return valuesets;
  }

  public void setValuesets(List<ChangedObject> valuesets) {
    this.valuesets = valuesets;
  }
  
  @Override
  public String toString() {
    return "{igDocumentId="+this.getIgDocumentId()+", segments count="+this.getSegments().size()+"}";
  }

}
