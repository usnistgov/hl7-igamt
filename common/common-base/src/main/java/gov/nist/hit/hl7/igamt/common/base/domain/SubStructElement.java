package gov.nist.hit.hl7.igamt.common.base.domain;

import gov.nist.diff.annotation.DeltaField;

public class SubStructElement extends StructureElement {

  @DeltaField
  private String maxLength;
  @DeltaField
  private String minLength;
  @DeltaField
  private String confLength;
  @DeltaField
  private Ref ref;

  public static final String NA = "NA";



  public SubStructElement() {
    super();
  }


  public SubStructElement(String id, String name, int position, Usage usage, Type type, String text,
      boolean custom, String maxLength, String minLength, String confLength, Ref ref) {
    super(id, name, position, usage, type, text, custom);
    this.maxLength = maxLength;
    this.minLength = minLength;
    this.confLength = confLength;
    this.ref = ref;
  }

  public String getMaxLength() {
    return maxLength;
  }

  public void setMaxLength(String maxLength) {
    this.maxLength = maxLength;
  }

  public String getMinLength() {
    return minLength;
  }

  public void setMinLength(String minLength) {
    this.minLength = minLength;
  }

  public String getConfLength() {
    return confLength;
  }

  public void setConfLength(String confLength) {
    this.confLength = confLength;
  }

  public Ref getRef() {
    return ref;
  }

  public void setRef(Ref ref) {
    this.ref = ref;
  }

}
