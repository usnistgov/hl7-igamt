package gov.nist.hit.hl7.igamt.shared.domain;

import org.springframework.data.annotation.Id;

public abstract class AbstractDomain {
  @Id
  private CompositeKey id;
  private String name;
  private PublicationInfo publicationInfo;
  private DomainInfo domainInfo;
  private String username;
  private String comment;
  private String description;
  private String createdFrom;



  public AbstractDomain() {
    super();
    // TODO Auto-generated constructor stub
  }

  public AbstractDomain(CompositeKey id, String version, String name,
      PublicationInfo publicationInfo, DomainInfo domainInfo, String username, String comment,
      String description) {
    super();
    this.name = name;
    this.publicationInfo = publicationInfo;
    this.domainInfo = domainInfo;
    this.setUsername(username);
    this.comment = comment;
    this.description = description;
  }

  public PublicationInfo getPublicationInfo() {
    return publicationInfo;
  }

  public void setPublicationInfo(PublicationInfo publicationInfo) {
    this.publicationInfo = publicationInfo;
  }

  public DomainInfo getDomainInfo() {
    return domainInfo;
  }

  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }


  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCreatedFrom() {
    return createdFrom;
  }

  public void setCreatedFrom(String createdFrom) {
    this.createdFrom = createdFrom;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

}
