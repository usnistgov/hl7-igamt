package gov.nist.hit.hl7.igamt.shared.domain;

public class Link {
  private CompositeKey id;
  private int position;
  
 public Link(CompositeKey id, int position) {
    super();
    this.id = id;
    this.position = position;
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

}
