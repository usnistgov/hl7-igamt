package gov.nist.hit.hl7.igamt.shared.domain;

public abstract class AbstractDomain {
    private String id;
    private String version;
    private String name;
    private PublicationInfo publicationInfo;
    private DomainInfo domainInfo;
    private String username;
    private String comment;
    private String description;
    
   
    public AbstractDomain() {
      super();
      // TODO Auto-generated constructor stub
    }

    public AbstractDomain(String id, String version, String name, PublicationInfo publicationInfo,
        DomainInfo domainInfo, String username, String comment, String description) {
      super();
      this.id = id;
      this.version = version;
      this.name = name;
      this.publicationInfo = publicationInfo;
      this.domainInfo = domainInfo;
      this.username = username;
      this.comment = comment;
      this.description = description;
    }

    public String getVersion() {
      return version;
    }
    public void setVersion(String version) {
      this.version = version;
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
    public String getUserName() {
      return username;
    }
    public void setUserName(String userName) {
      this.username = userName;
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

}
