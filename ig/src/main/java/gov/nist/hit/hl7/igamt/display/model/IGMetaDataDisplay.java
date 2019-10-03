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
package gov.nist.hit.hl7.igamt.display.model;

import java.util.List;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class IGMetaDataDisplay {
  
  private String title;
  private String version;
  private List<String> hl7Versions;
  private List<String> authors;
  private String organization;
  private String coverPicture;
  private String subTitle;
  private String scope;
  private String authorNotes;

  /**
   * 
   */
  public IGMetaDataDisplay() {
  }
  
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public List<String> getHl7Versions() {
    return hl7Versions;
  }

  public void setHl7Versions(List<String> hl7Versions) {
    this.hl7Versions = hl7Versions;
  }

  public String getCoverPicture() {
    return coverPicture;
  }

  public void setCoverPicture(String coverPicture) {
    this.coverPicture = coverPicture;
  }

  public String getSubTitle() {
    return subTitle;
  }

  public void setSubTitle(String subTitle) {
    this.subTitle = subTitle;
  }

  public String getScope() {
    return scope;
  }

  public void setScope(String scope) {
    this.scope = scope;
  }

  public List<String> getAuthors() {
    return authors;
  }

  public void setAuthors(List<String> authors) {
    this.authors = authors;
  }

  public String getAuthorNotes() {
    return authorNotes;
  }

  public void setAuthorNotes(String authorNotes) {
    this.authorNotes = authorNotes;
  }

  public String getOrganization() {
    return organization;
  }

  public void setOrganization(String organization) {
    this.organization = organization;
  }


  
}
