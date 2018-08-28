package gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class EventTreeData {

  private CompositeKey id;
  String name;
  String parentStructId;
  final Type type = Type.EVENT;

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getParentStructId() {
    return parentStructId;
  }

  public void setParentStructId(String parentStructId) {
    this.parentStructId = parentStructId;
  }

  public Type getType() {
    return type;
  }


}
