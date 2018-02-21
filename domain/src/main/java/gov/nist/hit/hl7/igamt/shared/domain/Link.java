package gov.nist.hit.hl7.igamt.shared.domain;

public class Link {
  private String id;
  private int position;
  
 public Link(String id, int position) {
    super();
    this.id = id;
    this.position = position;
  }

 public String getId() {
  return id;
}
 public void setId(String id) {
  this.id = id;
}
 public int getPosition() {
  return position;
}
 public void setPosition(int position) {
  this.position = position;
}

}
