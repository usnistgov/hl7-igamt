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
import java.util.List;

/**
 * @author ena3
 *
 */
public class DocumentMetadata implements Serializable{

  private String title;
  private String version;
  private List<String> hl7Versions;
  private String topics;
  private String identifier;
  private String orgName;
  private String coverPicture;
  private String subTitle;
  private String specificationName;
  
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


  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
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
  @Override
  public DocumentMetadata clone() {

    DocumentMetadata clone = new DocumentMetadata();
    clone.setCoverPicture(coverPicture);
    clone.setIdentifier(identifier);
    clone.setOrgName(orgName);
    clone.setSubTitle(subTitle);
    clone.setTitle(title);
    clone.setTopics(topics);
    return clone;
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

/**
 * @return
 */
public String getSpecificationName() {
  // TODO Auto-generated method stub
  return null;
}

public void setSpecificationName(String specificationName) {
  this.specificationName = specificationName;
}

}
