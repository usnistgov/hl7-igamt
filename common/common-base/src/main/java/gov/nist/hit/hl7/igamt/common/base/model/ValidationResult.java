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
package gov.nist.hit.hl7.igamt.common.base.model;

import java.util.HashMap;
import java.util.List;

/**
 * @author Harold Affo
 *
 */
public class ValidationResult implements java.io.Serializable {
  private static final long serialVersionUID = 1L;

  public ValidationResult() {

  }

  private String targetId;
  private String parentId;
  private Integer errorCount;
  private HashMap<String, List<ValidationError>> items;
  private HashMap<String, ValidationResult> blocks;


  public String getTargetId() {
    return targetId;
  }

  public void setTargetId(String targetId) {
    this.targetId = targetId;
  }

  public Integer getErrorCount() {
    return errorCount;
  }

  public void setErrorCount(Integer errorCount) {
    this.errorCount = errorCount;
  }


  public String getParentId() {
    return parentId;
  }

  public void setParentId(String parentId) {
    this.parentId = parentId;
  }

  public HashMap<String, List<ValidationError>> getItems() {
    return items;
  }

  public void setItems(HashMap<String, List<ValidationError>> items) {
    this.items = items;
  }

  public HashMap<String, ValidationResult> getBlocks() {
    return blocks;
  }

  public void setBlocks(HashMap<String, ValidationResult> blocks) {
    this.blocks = blocks;
  }



}
