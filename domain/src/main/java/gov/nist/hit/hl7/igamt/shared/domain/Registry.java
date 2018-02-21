package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "registry")
public class Registry<T extends Link> extends Section {
  
  private String description;
  private Set<T> children;
  private Type type;
  public Registry() {
    super();
    // TODO Auto-generated constructor stub
  }
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
  public Set<T> getChildren() {
    return children;
  }
  public void setChildren(Set<T> children) {
    this.children = children;
  }
  public Type getType() {
    return type;
  }
  public void setType(Type type) {
    this.type = type;
  }
}
