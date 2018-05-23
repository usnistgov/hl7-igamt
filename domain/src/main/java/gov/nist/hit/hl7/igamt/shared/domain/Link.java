package gov.nist.hit.hl7.igamt.shared.domain;

public class Link {
  private CompositeKey id;
  private int position;
  private DomainInfo domainInfo;
  private Type type;
  
 public Link(CompositeKey id, int position) {
    super();
    this.id = id;
    this.position = position;
  }
 
 public Link(CompositeKey id) {
	    super();
	    this.id = id;
	  }
 public CompositeKey getId() {
  return id;
}
 public void setId(CompositeKey id) {
  this.id = id;
}
 public int getPosition() {
  return position;
}
 public void setPosition(int position) {
  this.position = position;
}

public Link() {
	super();
	// TODO Auto-generated constructor stub
}

/**
 * @param id2
 * @param domainInfo2
 * @param i
 */
public Link(CompositeKey id2, DomainInfo domainInfo2, int position) {
  this.id=id2;
  this.domainInfo=domainInfo2;
  this.position=position;
  
  // TODO Auto-generated constructor stub
}

public DomainInfo getDomainInfo() {
  return domainInfo;
}

public void setDomainInfo(DomainInfo domainInfo) {
  this.domainInfo = domainInfo;
}

public Type getType() {
  return type;
}

public void setType(Type type) {
  this.type = type;
}

@Override
public boolean equals(Object obj) {
  // TODO Auto-generated method stub
 if(obj instanceof Link) {
   return ((Link)obj).getId().getId().equals(this.getId().getId());
 }else {
   return false;
 }
}
}
