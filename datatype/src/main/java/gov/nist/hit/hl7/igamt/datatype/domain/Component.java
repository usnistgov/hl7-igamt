package gov.nist.hit.hl7.igamt.datatype.domain;

import java.util.Set;

import gov.nist.diff.annotation.DeltaField;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class Component extends SubStructElement {
  
  
  public Component() {
    super();
    this.setType(Type.COMPONENT);
  }

  
}
