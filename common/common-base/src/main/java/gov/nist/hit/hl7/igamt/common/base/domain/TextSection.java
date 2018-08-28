package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.HashSet;
import java.util.Set;

import org.bson.types.ObjectId;



public class TextSection extends Section {

  private Set<TextSection> children = new HashSet<TextSection>();

  public TextSection(String id, String description, Type type, int position, String label) {
    super(id, description, type, position, label);
  }



  public TextSection() {
    super();

  }

  public Set<TextSection> getChildren() {
    return children;
  }

  public void setChildren(Set<TextSection> children) {
    this.children = children;
  }

  @Override
  public TextSection clone() {
    TextSection clone = new TextSection();
    clone.setId(new ObjectId().toString());
    clone.setDescription(this.getDescription());
    clone.setType(this.getType());
    clone.setLabel(this.getLabel());
    if (this.children != null && !this.children.isEmpty()) {
      clone.children = new HashSet<TextSection>();
      for (TextSection s : this.children) {
        clone.getChildren().add(s.clone());
      }
    }

    return clone;


  };



}
