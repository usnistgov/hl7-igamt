package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;
import java.util.Date;

public class PublicationInfo implements Serializable{
  private String publicationVersion;
  private Date publicationDate;

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

}
