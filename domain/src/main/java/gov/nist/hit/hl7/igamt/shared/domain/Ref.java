package gov.nist.hit.hl7.igamt.shared.domain;

public class Ref {
  private String id;

  public Ref() {
    
  }

  public Ref(String id) {
    super();
    this.id = id;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
  
  @Override
  public boolean equals(Object toCompare) {
	  return (toCompare instanceof Ref && ((Ref)toCompare).getId().equals(this.getId()));
  }

}
