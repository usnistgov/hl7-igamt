package gov.nist.hit.hl7.igamt.shared.domain;

public class StructureElement {
  private String id;
  private int position;
  private Usage usage;
  private Type type;
  private String text;
  private boolean custom = false;
  
  
  public int getPosition() {
    return position;
  }
  public void setPosition(int position) {
    this.position = position;
  }
  public Usage getUsage() {
    return usage;
  }
  public void setUsage(Usage usage) {
    this.usage = usage;
  }
  public String getText() {
    return text;
  }
  public void setText(String text) {
    this.text = text;
  }
  public boolean isCustom() {
    return custom;
  }
  public void setCustom(boolean custom) {
    this.custom = custom;
  }
  public StructureElement() {
    super();
    // TODO Auto-generated constructor stub
  }
  public Type getType() {
    return type;
  }
  public void setType(Type type) {
    this.type = type;
  }
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }

}
