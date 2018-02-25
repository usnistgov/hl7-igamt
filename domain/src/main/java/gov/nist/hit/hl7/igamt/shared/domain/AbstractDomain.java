package gov.nist.hit.hl7.igamt.shared.domain;

import org.springframework.data.annotation.Id;
import org.springframework.format.annotation.DateTimeFormat;

public abstract class AbstractDomain {
	@Id
	private CompositeKey id;
    private String name;
    private PublicationInfo publicationInfo;
    private DomainInfo domainInfo;
    private String username;
    private String comment;
    private String description;
    private CompositeKey createdFrom;
    private HashMap<DateType, Date> dates;
    
    
   
    public AbstractDomain() {
      super();
      // TODO Auto-generated constructor stub
    }

    public AbstractDomain(CompositeKey id, String version, String name, PublicationInfo publicationInfo,
        DomainInfo domainInfo, String username, String comment, String description) {
      super();
      this.name = name;
      this.publicationInfo = publicationInfo;
      this.domainInfo = domainInfo;
      this.username = username;
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


    public CompositeKey getId() {
		return id;
	}

	public void setId(CompositeKey id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

	public CompositeKey getCreatedFrom() {
		return createdFrom;
	}

	public void setCreatedFrom(CompositeKey createdFrom) {
		this.createdFrom = createdFrom;
	}

}
