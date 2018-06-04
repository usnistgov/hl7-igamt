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
public class NotAssertion extends MultipleAssertion {
  private Assertion child;
  private String complexAssertionType;

  
  public NotAssertion() {
    super();
    this.setMode(AssertionMode.COMPLEX);
    this.setComplexAssertionType("NOT");
  }

  public Assertion getChild() {
    return child;
  }

  public void setChild(Assertion child) {
    this.child = child;
  }

  @Override
  public String toString() {
    return "NotAssertion [child=" + child + "]";
  }

  public String getComplexAssertionType() {
    return complexAssertionType;
  }

  public void setComplexAssertionType(String complexAssertionType) {
    this.complexAssertionType = complexAssertionType;
  }


}
