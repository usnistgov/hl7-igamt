package gov.nist.hit.hl7.igamt.shared.domain;

public class Resource extends AbstractDomain {

  private String preDef;
  private String postDef;

  public Resource() {
    super();
    // TODO Auto-generated constructor stub
  }
  
  public Resource(String id, String version, PublicationInfo publicationInfo, DomainInfo domainInfo,
      String userName, String comment, String description, String preDef, String postDef) {
    super(id, version, publicationInfo, domainInfo, userName, comment, description);
    this.preDef = preDef;
    this.postDef = postDef;
  }

  public String getPreDef() {
    return preDef;
  }
  public void setPreDef(String preDef) {
    this.preDef = preDef;
  }
  public String getPostDef() {
    return postDef;
  }
  public void setPostDef(String postDef) {
    this.postDef = postDef;
  }
}
