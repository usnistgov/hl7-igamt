package gov.nist.hit.hl7.igamt.shared.messageEvent;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document
public class MessageEvents {
	@Id
  private String id;

  private String name;

  private final String type = "message";

  private Set<Event> children = new HashSet<Event>();

  private String description;

  public MessageEvents() {
    super();
  }

  public MessageEvents(String id, String structId, Set<String> events, String description) {
    this.id = id;
    this.name = structId;
    createEvents(events,structId);
    this.description = description;
  }

  void createEvents(Set<String> events,String parentStructId) {
    for (String event : events) {
      this.children.add(new Event(id, event,parentStructId));
    }
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getType() {
    return type;
  }

  public Set<Event> getChildren() {
    return children;
  }

  public String getDescription() {
    return description;
  }

public void setId(String id) {
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
  
  
  
  
}