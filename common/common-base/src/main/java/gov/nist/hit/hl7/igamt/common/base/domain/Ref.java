package gov.nist.hit.hl7.igamt.common.base.domain;

import gov.nist.diff.annotation.DeltaField;

public class Ref {

  @DeltaField
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
  public String toString() {
    return "Ref [id=" + id + "]";
  }


}
