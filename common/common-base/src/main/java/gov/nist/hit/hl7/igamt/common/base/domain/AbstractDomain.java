package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;

public abstract class AbstractDomain{
  @Id
  private String id;
  private String name;
  private PublicationInfo publicationInfo;
  private DomainInfo domainInfo;
  private String username;
  private String comment;
  private String description;
  private String createdFrom;
  private String authorNotes;
  private String usageNotes;
  private Type type;

  @CreatedDate
  private Date creationDate;

  @LastModifiedDate
  private Date updateDate;
  private String from;

  @Version
  private Long version;

  public AbstractDomain() {
    super();
    // TODO Auto-generated constructor stub
  }

  public AbstractDomain(String id, String version, String name,
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


  public String getId() {
    return id;
  }

  public void setId(String id) {
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

  public Date getCreationDate() {
    return creationDate;
  }

  public void setCreationDate(Date creationDate) {
    this.creationDate = creationDate;
  }

  public Date getUpdateDate() {
    return updateDate;
  }

  public void setUpdateDate(Date updateDate) {
    this.updateDate = updateDate;
  }

  public abstract String getLabel();

  public String getFrom() {
    return from;
  }

  public void setFrom(String from) {
    this.from = from;
  }
  public Long getVersion() {
    return version;
  }

  public void setVersion(Long version) {
    this.version = version;
  }

  protected void complete(AbstractDomain elm) {
	elm.name = name;
	elm.publicationInfo = publicationInfo;
	elm.domainInfo = domainInfo;
	elm.username = username;
	elm.comment = comment;
	elm.description = description;
	elm.createdFrom = createdFrom;
	elm.creationDate = creationDate;
	elm.updateDate = updateDate;
	elm.setType(type);
	elm.from = id;
  }

public String getAuthorNotes() {
	return authorNotes;
}

public void setAuthorNotes(String authorNotes) {
	this.authorNotes = authorNotes;
}

public String getUsageNotes() {
	return usageNotes;
}

public void setUsageNotes(String usageNotes) {
	this.usageNotes = usageNotes;
}

public Type getType() {
  return type;
}

public void setType(Type type) {
  this.type = type;
}

  
  



}