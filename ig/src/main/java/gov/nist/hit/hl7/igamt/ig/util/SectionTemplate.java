package gov.nist.hit.hl7.igamt.ig.util;

import java.util.Set;

public class SectionTemplate {


  private String label;
  private String type;
  private int position;

  private Set<SectionTemplate> children;

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }


  public SectionTemplate() {
    super();
    // TODO Auto-generated constructor stub
  }



  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public Set<SectionTemplate> getChildren() {
    return children;
  }

  public void setChildren(Set<SectionTemplate> children) {
    this.children = children;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }



}
