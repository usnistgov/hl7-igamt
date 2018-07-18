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
 * 
 */

package gov.nist.hit.hl7.igamt.common.base.model;


/**
 * 
 * @author Harold Affo
 *
 */
public class ValidationError implements java.io.Serializable {
  private static final long serialVersionUID = 1L;

  public ValidationError() {

  }

  private String targetId;
  private String parentId;
  private String targetName;
  private String targetType;
  private Integer position;
  private ValidationType validationType;
  private String errorMessage;
  private String type;


  public String getTargetId() {
    return targetId;
  }

  public void setTargetId(String targetId) {
    this.targetId = targetId;
  }



  public String getParentId() {
    return parentId;
  }

  public void setParentId(String parentId) {
    this.parentId = parentId;
  }

  public String getTargetName() {
    return targetName;
  }

  public void setTargetName(String targetName) {
    this.targetName = targetName;
  }


  public String getTargetType() {
    return targetType;
  }

  public void setTargetType(String targetType) {
    this.targetType = targetType;
  }

  public Integer getPosition() {
    return position;
  }

  public void setPosition(Integer position) {
    this.position = position;
  }

  public ValidationType getValidationType() {
    return validationType;
  }

  public void setValidationType(ValidationType validationType) {
    this.validationType = validationType;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }



}
