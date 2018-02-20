package gov.nist.hit.hl7.igamt.shared.domain;

public abstract class AbstractDomain {
    private String id;
    private String version;
    private PublicationInfo publicationInfo;
    private DomainInfo domainInfo;
    private String userName;
    private  String comment;
    private String description;
   
    public AbstractDomain() {
      super();
      // TODO Auto-generated constructor stub
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
      return userName;
    }
    public void setUserName(String userName) {
      this.userName = userName;
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

}
