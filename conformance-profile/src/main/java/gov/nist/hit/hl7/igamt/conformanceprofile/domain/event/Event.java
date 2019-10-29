package gov.nist.hit.hl7.igamt.conformanceprofile.domain.event;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class Event {

  private String id;
  String name;
  String parentStructId;
  private String description; 
  private Type type = Type.EVENT;
  public void setType(Type type) {
	this.type = type;
}

private String hl7Version;

  public Event() {
    super();
  }

  public Event(String id, String event, String parentStructId, String hl7Version) {
    super();
    this.id = id;
    this.name = event;
    this.parentStructId = parentStructId;
    this.hl7Version=hl7Version;
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

  @Override
public int hashCode() {
	final int prime = 31;
	int result = 1;
	result = prime * result + ((hl7Version == null) ? 0 : hl7Version.hashCode());
	result = prime * result + ((id == null) ? 0 : id.hashCode());
	result = prime * result + ((name == null) ? 0 : name.hashCode());
	result = prime * result + ((parentStructId == null) ? 0 : parentStructId.hashCode());
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
	Event other = (Event) obj;
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
	if (parentStructId == null) {
		if (other.parentStructId != null)
			return false;
	} else if (!parentStructId.equals(other.parentStructId))
		return false;
	if (type != other.type)
		return false;
	return true;
}

public Type getType() {
    return type;
  }

  public void setId(String id) {
    this.id = id;
  }

public String getHl7Version() {
	return hl7Version;
}

public void setHl7Version(String hl7Version) {
	this.hl7Version = hl7Version;
}

public String getDescription() {
  return description;
}

public void setDescription(String description) {
  this.description = description;
}
}
