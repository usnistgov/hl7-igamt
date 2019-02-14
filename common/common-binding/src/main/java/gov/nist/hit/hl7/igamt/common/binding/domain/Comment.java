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
package gov.nist.hit.hl7.igamt.common.binding.domain;

import java.util.Date;
import gov.nist.diff.annotation.DeltaField;

/**
 * @author jungyubw
 *
 */
public class Comment {
  @DeltaField
  private String description;
  @DeltaField
  private String username;
  @DeltaField
  private Date dateupdated;

  public Comment(String description, String username, Date dateupdated) {
    super();
    this.description = description;
    this.username = username;
    this.dateupdated = dateupdated;
  }

  public Comment() {
    super();
    this.dateupdated = new Date();
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public Date getDateupdated() {
    return dateupdated;
  }

  public void setDateupdated(Date dateupdated) {
    this.dateupdated = dateupdated;
  }


}
