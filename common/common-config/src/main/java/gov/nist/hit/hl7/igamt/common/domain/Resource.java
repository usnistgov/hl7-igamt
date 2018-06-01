package gov.nist.hit.hl7.igamt.common.domain;

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
}
