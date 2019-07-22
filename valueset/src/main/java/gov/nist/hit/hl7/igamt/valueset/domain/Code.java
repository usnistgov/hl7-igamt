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
package gov.nist.hit.hl7.igamt.valueset.domain;

import java.io.Serializable;

import org.bson.types.ObjectId;

/**
 * @author jungyubw
 *
 */

public class Code implements Serializable{
  /**
   * 
   */
  private static final long serialVersionUID = 3734129200317300616L;
  private String value;
  private String description;
  private String codeSystem;
  private String comments;
  private CodeUsage usage;
  private String id;

  public Code() {
    this.setId(new ObjectId().toString());
    this.setUsage(CodeUsage.P);
  }

  public Code(String value, String description, String codeSystem, String comments) {
    this.setId(new ObjectId().toString());
    this.setUsage(CodeUsage.P);
    this.value = value;
    this.description = description;
    this.codeSystem = codeSystem;
    this.comments = comments;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getCodeSystem() {
    return codeSystem;
  }

  public void setCodeSystem(String codeSystem) {
    this.codeSystem = codeSystem;
  }

  public String getComments() {
    return comments;
  }

  public void setComments(String comments) {
    this.comments = comments;
  }

  public CodeUsage getUsage() {
    return usage;
  }

  public void setUsage(CodeUsage usage) {
    this.usage = usage;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

}
