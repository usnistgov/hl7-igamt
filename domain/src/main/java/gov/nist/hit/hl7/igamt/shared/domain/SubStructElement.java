package gov.nist.hit.hl7.igamt.shared.domain;


public class SubStructElement extends StructureElement {
  
  private String maxLength;
  private String minLength;
  private String confLength;
  private Ref ref;
  public SubStructElement() {
    super();
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
