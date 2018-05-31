package gov.nist.hit.hl7.igamt.conformanceprofile.domain.event;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class Event {

  private CompositeKey id;
  String name;
  String parentStructId;
  final Type type = Type.EVENT;

  public Event() {
    super();
  }

  public Event(CompositeKey id, String event, String parentStructId) {
    super();
    this.id = id;
    this.name = event;
    this.parentStructId = parentStructId;
  }

  public String getParentStructId() {
    return parentStructId;
  }

  public void setParentStructId(String parentStructId) {
    this.parentStructId = parentStructId;
  }

  public CompositeKey getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Type getType() {
    return type;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }
}
