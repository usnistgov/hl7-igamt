package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;

public class Resgistry {

  private int position;
  private String description;
  private Set<Link> children;
  public Resgistry() {
    super();
    // TODO Auto-generated constructor stub
  }
  public int getPosition() {
    return position;
  }
  public void setPosition(int position) {
    this.position = position;
  }
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
  public Set<Link> getChildren() {
    return children;
  }
  public void setChildren(Set<Link> children) {
    this.children = children;
  }
}
