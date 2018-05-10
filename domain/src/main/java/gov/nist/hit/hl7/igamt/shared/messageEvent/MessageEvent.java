package gov.nist.hit.hl7.igamt.shared.messageEvent;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
@Document
public class MessageEvent {
	@Id
  private CompositeKey id;

  private String name;

  private Type type = Type.EVENTS;

  private Set<Event> children = new HashSet<Event>();

  private String description;
  
  private String hl7Version;

  public MessageEvent() {
    super();
  }

  public MessageEvent(CompositeKey id, String structId, Set<String> events, String description,String hl7Version) {
    this.id = id;
    this.name = structId;
    createEvents(events,structId);
    this.description = description;
    this.hl7Version=hl7Version;
  }

  void createEvents(Set<String> events,String parentStructId) {
    for (String event : events) {
      this.children.add(new Event(id, event,parentStructId));
    }
  }

  public CompositeKey getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
	this.type = type;
}

public Set<Event> getChildren() {
    return children;
  }

  public String getDescription() {
    return description;
  }

public void setId(CompositeKey id) {
	this.id = id;
}

public void setName(String name) {
	this.name = name;
}

public void setChildren(Set<Event> children) {
	this.children = children;
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
  
  
  
  
}