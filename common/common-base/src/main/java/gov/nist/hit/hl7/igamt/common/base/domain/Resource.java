package gov.nist.hit.hl7.igamt.common.base.domain;

public abstract class Resource extends AbstractDomain {

  private String preDef;
  private String postDef;
  

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
  }  
  
 
  
  
}
