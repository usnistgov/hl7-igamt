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

import org.bson.types.ObjectId;

/**
 * @author jungyubw
 *
 */

public class Code {
  private String id;
  private String value;
  private String description;
  private String codeSystemId;
  private String comments;

  public Code() {
    super();
    this.id = new ObjectId().toString();
  }

  public Code(String id, String value, String description, String codeSystemId, String comments) {
    super();
    this.id = id;
    this.value = value;
    this.description = description;
    this.codeSystemId = codeSystemId;
    this.comments = comments;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
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

  public String getCodeSystemId() {
    return codeSystemId;
  }

  public void setCodeSystemId(String codeSystemId) {
    this.codeSystemId = codeSystemId;
  }

  public String getComments() {
    return comments;
  }

  public void setComments(String comments) {
    this.comments = comments;
  }


}
