package gov.nist.hit.hl7.igamt.datatype.domain;

import java.util.Set;

import gov.nist.diff.annotation.DeltaField;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class Component extends SubStructElement {
  
  @DeltaField
  private String constantValue;
  
  @DeltaField
  private Set<Comment> comments;
  
  public Component() {
    super();
    this.setType(Type.COMPONENT);
  }

  public String getConstantValue() {
    return constantValue;
  }

  public void setConstantValue(String constantValue) {
    this.constantValue = constantValue;
  }

  public Set<Comment> getComments() {
    return comments;
  }

  public void setComments(Set<Comment> comments) {
    this.comments = comments;
  }

  
}
