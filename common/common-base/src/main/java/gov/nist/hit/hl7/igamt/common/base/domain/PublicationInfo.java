package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.Date;

public class PublicationInfo {
  private String publicationVersion;
  private Date publicationDate;
  private STATUS status;

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

  public STATUS getStatus() {
    return status;
  }

  public void setStatus(STATUS status) {
    this.status = status;
  }

}
