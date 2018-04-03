package gov.nist.hit.hl7.igamt.shared.messageEvent;

import gov.nist.hit.hl7.igamt.shared.domain.Type;

public class Event {

  String id;
  String name;
  String parentStructId;
  final Type type = Type.EVENT;

  public Event() {
    super();
  }

  public Event(String id, String event,String parentStructId) {
    super();
    this.id = id;
    this.name = event;
    this.parentStructId=parentStructId;
  }

  public String getParentStructId() {
	return parentStructId;
}

public void setParentStructId(String parentStructId) {
	this.parentStructId = parentStructId;
}

public String getId() {
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

public void setId(String id) {
	this.id = id;
}
}
