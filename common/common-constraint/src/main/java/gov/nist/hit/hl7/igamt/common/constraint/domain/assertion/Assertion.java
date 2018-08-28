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

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * @author jungyubw
 *
 */

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "mode")
@JsonSubTypes({@JsonSubTypes.Type(value = SingleAssertion.class, name = "SIMPLE"),
    @JsonSubTypes.Type(value = IfThenAssertion.class, name = "IFTHEN"),
    @JsonSubTypes.Type(value = NotAssertion.class, name = "NOT"),
    @JsonSubTypes.Type(value = OperatorAssertion.class, name = "ANDOR")})
public abstract class Assertion {
  private AssertionMode mode;
  private String description;

  public Assertion() {
    super();
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public AssertionMode getMode() {
    return mode;
  }

  public void setMode(AssertionMode mode) {
    this.mode = mode;
  }
}
