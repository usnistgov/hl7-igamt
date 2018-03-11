package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;



public class TextSection<T> extends Section {
  
  private String parentId;
  private Set<T> children;
  
  
  
  public TextSection() {
    super();
    this.setType(Type.TEXT);
  }

  public String getParentId() {
    return parentId;
  }
  public void setParentId(String parentId) {
    this.parentId = parentId;
  }
  public Set<T> getChildren() {
    return children;
  }
  public void setChildren(Set<T> children) {
    this.children = children;
  }


}
