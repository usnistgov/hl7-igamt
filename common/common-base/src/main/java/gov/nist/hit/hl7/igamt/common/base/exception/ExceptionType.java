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
package gov.nist.hit.hl7.igamt.common.base.exception;

/**
 * @author ena3
 *
 */
public enum ExceptionType {

  XREFERENCEFOUND("XREFERENCEFOUND");

  ExceptionType(String value) {
    this.value = value;
  }

  private final String value;

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    // TODO Auto-generated method stub
    return this.value;
  }

  public static ExceptionType fromString(String text) {
    for (ExceptionType t : ExceptionType.values()) {
      if (t.value.equalsIgnoreCase(text)) {
        return t;
      }
    }
    return null;
  }

}
