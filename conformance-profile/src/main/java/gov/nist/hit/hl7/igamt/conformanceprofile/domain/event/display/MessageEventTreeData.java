package gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class MessageEventTreeData {
  private String name;
  private String description;
  private String hl7Version;
  private Type type = Type.EVENTS;
  private String id;


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getHl7Version() {
    return hl7Version;
  }

  public void setHl7Version(String hl7Version) {
    this.hl7Version = hl7Version;
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
