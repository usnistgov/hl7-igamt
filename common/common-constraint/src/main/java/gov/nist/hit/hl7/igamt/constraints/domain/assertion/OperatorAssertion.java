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

import java.util.HashSet;
import java.util.Set;

/**
 * @author jungyubw
 *
 */
public class OperatorAssertion extends Assertion {

  public enum Operator {
    AND, OR, XOR
  }

  private Operator operator;
  private Set<Assertion> assertions = new HashSet<Assertion>();

  public OperatorAssertion() {
    super();
    this.setMode(AssertionMode.ANDOR);
  }

  public Set<Assertion> getAssertions() {
    return assertions;
  }

  public void setAssertions(Set<Assertion> assertions) {
    this.assertions = assertions;
  }

  public Operator getOperator() {
    return operator;
  }

  public void setOperator(Operator operator) {
    this.operator = operator;
  }
  
  public void addAssertion(Assertion assertion){
    this.assertions.add(assertion);
  }

  @Override
  public String toString() {
    return "OperatorAssertion [operator=" + operator + ", assertions=" + assertions + "]";
  }


}
