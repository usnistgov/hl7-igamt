package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;

public class Group extends MsgStructElement {

  private String name;
  private  Set< MsgStructElement> children;
    
  public Group() {
    
    super();
    this.setType(Type.GROUP);
  }
  
  public Set< MsgStructElement> getChildren() {
    return children;
  }
  public void setChildren(Set< MsgStructElement> children) {
    this.children = children;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  
}
