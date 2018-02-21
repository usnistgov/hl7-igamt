package gov.nist.hit.hl7.igamt.shared.domain;

public class SegmentRef extends MsgStructElement {
 private Ref Ref;

public SegmentRef() {
  
  super();
  this.setType(Type.SEGMENTREF);
  // TODO Auto-generated constructor stub
}

public Ref getRef() {
  return Ref;
}

public void setRef(Ref ref) {
  Ref = ref;
}

 
}
