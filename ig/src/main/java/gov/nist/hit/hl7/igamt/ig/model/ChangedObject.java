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

/**
 *
 * @author Maxence Lefort on May 1, 2018.
 */
public class ChangedObject {

  private String id;
  private Object metadata;
  private Object definition;
  private Object crossReference;
  
  public ChangedObject() {
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Object getMetadata() {
    return metadata;
  }

  public void setMetadata(Object metadata) {
    this.metadata = metadata;
  }

  public Object getDefinition() {
    return definition;
  }

  public void setDefinition(Object definition) {
    this.definition = definition;
  }

  public Object getCrossReference() {
    return crossReference;
  }

  public void setCrossReference(Object crossReference) {
    this.crossReference = crossReference;
  }

}
