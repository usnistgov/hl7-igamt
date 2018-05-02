package gov.nist.hit.hl7.igamt.shared.domain;

public class Section {
  
  private String id; 
  private String description;
  private Type type;
  private int position;
  private String label;
  
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
  public Type getType() {
    return type;
  }
  public void setType(Type type) {
    this.type = type;
  }
  public int getPosition() {
    return position;
  }
  public void setPosition(int position) {
    this.position = position;
  }
  public String getLabel() {
	return label;
  }
  public void setLabel(String label) {
	this.label = label;
  }


}
