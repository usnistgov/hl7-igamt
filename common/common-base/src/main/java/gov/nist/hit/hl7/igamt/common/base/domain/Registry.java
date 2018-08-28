package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.HashSet;
import java.util.Set;

public class Registry {

  private Set<Link> children = new HashSet<Link>();
  protected Type type;


  public Set<Link> getChildren() {
    return children;
  }

  public void setChildren(Set<Link> children) {
    this.children = children;
  }

  public Registry() {

  }

  /**
   * @return
   */
  public Type getType() {
    // TODO Auto-generated method stub
    return type;
  }


}
