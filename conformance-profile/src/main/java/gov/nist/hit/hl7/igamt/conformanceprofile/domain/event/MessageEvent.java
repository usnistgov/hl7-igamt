package gov.nist.hit.hl7.igamt.conformanceprofile.domain.event;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;


@Document
public class MessageEvent {
  @Id
  private  String id;

  private String name;

  private Type type = Type.EVENTS;

  private List<Event> children = new ArrayList<Event>();

  @Override
public int hashCode() {
	final int prime = 31;
	int result = 1;
	result = prime * result + ((children == null) ? 0 : children.hashCode());
	result = prime * result + ((description == null) ? 0 : description.hashCode());
	result = prime * result + ((hl7Version == null) ? 0 : hl7Version.hashCode());
	result = prime * result + ((id == null) ? 0 : id.hashCode());
	result = prime * result + ((name == null) ? 0 : name.hashCode());
	result = prime * result + ((type == null) ? 0 : type.hashCode());
	return result;
}

@Override
public boolean equals(Object obj) {
	if (this == obj)
		return true;
	if (obj == null)
		return false;
	if (getClass() != obj.getClass())
		return false;
	MessageEvent other = (MessageEvent) obj;
	if (children == null) {
		if (other.children != null)
			return false;
	} else if (!children.equals(other.children))
		return false;
	if (description == null) {
		if (other.description != null)
			return false;
	} else if (!description.equals(other.description))
		return false;
	if (hl7Version == null) {
		if (other.hl7Version != null)
			return false;
	} else if (!hl7Version.equals(other.hl7Version))
		return false;
	if (id == null) {
		if (other.id != null)
			return false;
	} else if (!id.equals(other.id))
		return false;
	if (name == null) {
		if (other.name != null)
			return false;
	} else if (!name.equals(other.name))
		return false;
	if (type != other.type)
		return false;
	return true;
}

private String description;

  private String hl7Version;

  public MessageEvent() {
    super();
  }

  public MessageEvent(String id, String structId, List<String> events, String description,
      String hl7Version) {
    this.id = id;
    this.name = structId;
    createEvents(events, structId,hl7Version);
    this.description = description;
    this.hl7Version = hl7Version;
  }

  void createEvents(List<String> events, String parentStructId,String hl7Version) {
	  System.out.println(events);
	  
    for (int i=0;i< events.size() ; i++) {
    		Event newEvent= new Event(id, events.get(i), parentStructId,hl7Version);
    		 this.children.add(newEvent);
    }
  }

  public String getId() {
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

  public List<Event> getChildren() {
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

  public void setChildren(List<Event> children) {
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
