package gov.nist.hit.hl7.igamt.common.base.domain;

public abstract class Resource extends AbstractDomain {

  private String preDef;
  private String postDef;
  protected String parentId;
  protected Type parentType;
  private String purposeAndUse;
  private String shortDescription;
  

  public Resource() {
    super();
    // TODO Auto-generated constructor stub
  }


  public Resource(String preDef, String postDef) {
    super();
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
  
  public abstract Resource clone();
  
  protected void complete(Resource elm) {
      super.complete(elm);
      elm.postDef=preDef;
      elm.postDef=postDef;
      elm.parentId = parentId;
      elm.parentType = parentType;
      elm.shortDescription = shortDescription;
      elm.purposeAndUse = purposeAndUse;
      elm.setActiveInfo(new ActiveInfo());
  }


  public String getParentId() {
    return parentId;
  }


  public void setParentId(String documentId) {
    this.parentId = documentId;
  }


  public Type getParentType() {
    return parentType;
  }


  public void setParentType(Type documentType) {
    this.parentType = documentType;
  }


  public String getPurposeAndUse() {
    return purposeAndUse;
  }


  public void setPurposeAndUse(String purposeAndUse) {
    this.purposeAndUse = purposeAndUse;
  }


  public String getShortDescription() {
    return shortDescription;
  }


  public void setShortDescription(String shortDescription) {
    this.shortDescription = shortDescription;
  }  
  
 // abstract String getSectionTitle();
  
  public String getPublicationDateString() {
    String s = null;
    if(this.getPublicationInfo() !=null && this.getPublicationInfo().getPublicationDate() !=null) {
      s = this.getPublicationInfo().getPublicationDate().toString();
      if(this.getActiveInfo() !=null && this.getActiveInfo().getStatus() !=null && this.getActiveInfo().getStatus().equals(ActiveStatus.DEPRECATED)) {
        s = '[' + s + "," + this.getActiveInfo().getEnd() + "]";
      }
    }
    return s;
  }
}
