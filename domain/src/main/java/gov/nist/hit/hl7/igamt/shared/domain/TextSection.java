package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;



public class TextSection extends Section {
  
  public TextSection(String id, String description, Type type, int position, String label) {
    super(id, description, type, position, label);
  }

  private Set<TextSection> children;

  
  public TextSection() {
    super();
    
  }
  public Set<TextSection> getChildren() {
	return children;
  }

  public void setChildren(Set<TextSection> children) {
	this.children = children;
  }
 


}
