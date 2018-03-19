package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;
public class Registry extends Section {
  
  private Set<Link> children = new HashSet<Link>();
  public Registry() {
    super();
    // TODO Auto-generated constructor stub
  }
  public Set<Link> getChildren() {
    return children;
  }
  public void setChildren(Set<Link> children) {
    this.children = children;
  }


}
