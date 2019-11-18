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
package gov.nist.hit.hl7.igamt.verification.service.impl;

/**
 * @author jungyubw
 *
 */
public class IgamtObjectError {
  
  private String targetType;
  private String targetId;
  
  private String errorType;
  private String errorTarget;
  private String errorDescription;
  private String errorLocation;
  
  private String severity;
  
  public IgamtObjectError(){
    super();
  }

  public IgamtObjectError(String targetType, String targetId, String errorType, String errorTarget,
      String errorDescription, String errorLocation, String severity) {
    super();
    this.targetType = targetType;
    this.targetId = targetId;
    this.errorType = errorType;
    this.errorTarget = errorTarget;
    this.errorDescription = errorDescription;
    this.errorLocation = errorLocation;
    this.severity = severity;
  }

  public String getTargetType() {
    return targetType;
  }

  public void setTargetType(String targetType) {
    this.targetType = targetType;
  }

  public String getTargetId() {
    return targetId;
  }

  public void setTargetId(String targetId) {
    this.targetId = targetId;
  }

  public String getErrorType() {
    return errorType;
  }

  public void setErrorType(String errorType) {
    this.errorType = errorType;
  }

  public String getErrorDescription() {
    return errorDescription;
  }

  public void setErrorDescription(String errorDescription) {
    this.errorDescription = errorDescription;
  }

  public String getErrorLocation() {
    return errorLocation;
  }

  public void setErrorLocation(String errorLocation) {
    this.errorLocation = errorLocation;
  }

  public String getSeverity() {
    return severity;
  }

  public void setSeverity(String severity) {
    this.severity = severity;
  }

  public String getErrorTarget() {
    return errorTarget;
  }

  public void setErrorTarget(String errorTarget) {
    this.errorTarget = errorTarget;
  }
  
  

}
