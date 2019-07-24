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
package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;

/**
 * @author ena3
 *
 */
public class DocumentMetadata implements Serializable{

  private String title;

  private String topics;
  private String specificationName;
  private String identifier;
  private String implementationNotes;
  private String orgName;
  private String coverPicture;
  private String subTitle;
  private Scope scope;

  public DocumentMetadata() {
    super();
    // TODO Auto-generated constructor stub
  }

  public String getTopics() {
    return topics;
  }

  public void setTopics(String topics) {
    this.topics = topics;
  }

  public String getSpecificationName() {
    return specificationName;
  }

  public void setSpecificationName(String specificationName) {
    this.specificationName = specificationName;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public String getImplementationNotes() {
    return implementationNotes;
  }

  public void setImplementationNotes(String implementationNotes) {
    this.implementationNotes = implementationNotes;
  }

  public String getOrgName() {
    return orgName;
  }

  public void setOrgName(String orgName) {
    this.orgName = orgName;
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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  @Override
  public DocumentMetadata clone() {

    DocumentMetadata clone = new DocumentMetadata();
    clone.setCoverPicture(coverPicture);
    clone.setIdentifier(identifier);
    clone.setImplementationNotes(implementationNotes);
    clone.setOrgName(orgName);
    clone.setSpecificationName(specificationName);
    clone.setScope(scope);
    clone.setSubTitle(subTitle);
    clone.setTitle(title);
    clone.setTopics(topics);
    return clone;
  }

}
