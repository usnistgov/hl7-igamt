package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;
import java.util.Date;

public class PublicationInfo implements Serializable{
  private String publicationVersion;
  private Date publicationDate;
  private String warning; 

  public PublicationInfo() {
    super();
  }

  public String getPublicationVersion() {
    return publicationVersion;
  }

  public void setPublicationVersion(String publicationVersion) {
    this.publicationVersion = publicationVersion;
  }

  public Date getPublicationDate() {
    return publicationDate;
  }

  public void setPublicationDate(Date publicationDate) {
    this.publicationDate = publicationDate;
  }

  public String getWarning() {
	return warning;
  }

  public void setWarning(String warning) {
	this.warning = warning;
  }

}
