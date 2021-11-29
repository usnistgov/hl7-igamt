package gov.nist.hit.hl7.igamt.conformanceprofile.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class SegmentRef extends SegmentRefOrGroup {
  private Ref ref;

  public SegmentRef() {
    super();
    this.setType(Type.SEGMENTREF);
  }

  public Ref getRef() {
    return ref;
  }

  public void setRef(Ref ref) {
    this.ref = ref;
  }

}
