package gov.nist.hit.hl7.igamt.shared.domain;

public class SegmentRef extends MsgStructElement {
  private Ref ref;

  public SegmentRef() {
    super();
    this.setType(Type.SEGMENTREF);
  }

  public SegmentRef(String id, String name, int position, Usage usage, String text, boolean custom,
      int min, String max, Ref ref) {
    super(id, name, position, usage, Type.SEGMENTREF, text, custom, min, max);
    this.ref = ref;
  }

  public Ref getRef() {
    return ref;
  }

  public void setRef(Ref ref) {
    this.ref = ref;
  }

}