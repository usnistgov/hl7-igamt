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
package gov.nist.hit.hl7.igamt.verification.domain;

import gov.nist.hit.hl7.igamt.verification.domain.VerificationReport.ErrorType;

/**
 * @author jungyubw
 *
 */
public class CustomProfileError {
  private String errorMessage;
  private DocumentTarget target;
  private String location;
  private ErrorType errorType;

  public CustomProfileError() {
    super();
  }

  public CustomProfileError(ErrorType errorType, String errorMessage, DocumentTarget target,
      String location) {
    super();
    this.errorMessage = errorMessage;
    this.target = target;
    this.location = location;
    this.errorType = errorType;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  public DocumentTarget getTarget() {
    return target;
  }

  public void setTarget(DocumentTarget target) {
    this.target = target;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public ErrorType getErrorType() {
    return errorType;
  }

  public void setErrorType(ErrorType errorType) {
    this.errorType = errorType;
  }

  @Override
  public String toString() {
    return "CustomProfileError [errorMessage=" + errorMessage + ", target=" + target + ", location="
        + location + ", errorType=" + errorType + "]";
  }


}
