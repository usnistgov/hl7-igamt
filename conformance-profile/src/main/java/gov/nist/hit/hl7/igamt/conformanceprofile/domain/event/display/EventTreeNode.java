package gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display;


public class EventTreeNode implements Comparable<EventTreeNode>{
  EventTreeData data;
  private String name;


  public EventTreeData getData() {
    return data;
  }

  public void setData(EventTreeData data) {
    this.data = data;
  }

  public EventTreeNode() {}
  
  @Override
  public int compareTo(EventTreeNode o) {
    // TODO Auto-generated method stub
    return this.name.compareTo(o.getName());
  }

private String getName() {
	// TODO Auto-generated method stub
	return name;
}

public void setName(String name) {
	// TODO Auto-generated method stub
	this.name=name;
}

@Override
public int hashCode() {
	final int prime = 31;
	int result = 1;
	result = prime * result + ((data == null) ? 0 : data.hashCode());
	result = prime * result + ((name == null) ? 0 : name.hashCode());
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
	EventTreeNode other = (EventTreeNode) obj;
	if (data == null) {
		if (other.data != null)
			return false;
	} else if (!data.equals(other.data))
		return false;
	if (name == null) {
		if (other.name != null)
			return false;
	} else if (!name.equals(other.name))
		return false;
	return true;
}


  

}
