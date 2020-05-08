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
package gov.nist.hit.hl7.igamt.common.constraint.domain.assertion;

/**
 * @author jungyubw
 *
 */
public class Path {

  /*
   * elementId contains element mongo id for
   * ConformanceProfileId/SegmentId/DatatypeId/FieldId/ComponentId ex) MSH-3.1 elementId of this :
   * MSH id elementId of child : 3rd field Id elementId of child of child : 1st component id of 3rd
   * field Datatype
   */
  private String elementId;
  private InstancePath child;


  public Path() {
	super();
	// TODO Auto-generated constructor stub
}

public String getElementId() {
    return elementId;
  }

  public void setElementId(String elementId) {
    this.elementId = elementId;
  }

  public InstancePath getChild() {
    return child;
  }

  public void setChild(InstancePath child) {
    this.child = child;
  }

  @Override
  public String toString() {
    return "Path [elementId=" + elementId + ", child=" + child + "]";
  }

  

}
