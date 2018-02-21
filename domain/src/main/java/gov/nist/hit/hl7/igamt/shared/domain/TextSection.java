package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "textSection")
public class TextSection extends Section {
  
  private String id;
  private String parentId;
  private Set<Section> children;
  
  public TextSection() {
    super();
    this.setType(Type.TEXT);
  }
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  public String getParentId() {
    return parentId;
  }
  public void setParentId(String parentId) {
    this.parentId = parentId;
  }
  public Set<Section> getChildren() {
    return children;
  }
  public void setChildren(Set<Section> children) {
    this.children = children;
  }


}
