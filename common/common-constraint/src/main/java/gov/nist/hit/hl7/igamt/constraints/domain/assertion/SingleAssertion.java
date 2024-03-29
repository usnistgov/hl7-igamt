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
package gov.nist.hit.hl7.igamt.constraints.domain.assertion;

import gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement.Complement;

/**
 * @author jungyubw
 *
 */
public class SingleAssertion extends Assertion {

  private String id;
  private Subject subject;
  private String verbKey;
  private Complement complement;

  public SingleAssertion() {
    super();
    this.setMode(AssertionMode.SIMPLE);
  }

  public Subject getSubject() {
    return subject;
  }

  public void setSubject(Subject subject) {
    this.subject = subject;
  }

  public String getVerbKey() {
    return verbKey;
  }

  public void setVerbKey(String verbKey) {
    this.verbKey = verbKey;
  }

  public Complement getComplement() {
    return complement;
  }

  public void setComplement(Complement complement) {
    this.complement = complement;
  }

  @Override
  public String toString() {
    return "SingleAssertion [subject=" + subject + ", verbKey=" + verbKey + ", complement="
        + complement + "]";
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
}
