package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.Set;

import gov.nist.diff.annotation.DeltaField;

public class SubStructElement extends StructureElement {

  @DeltaField
  private String maxLength;
  @DeltaField
  private String minLength;
  @DeltaField
  private String confLength;
  
  private LengthType lengthType;
  
  private Ref ref;

  public static final String NA = "NA";
  
  private StandardKey conceptDomain;
  
  private String constantValue;


  public SubStructElement() {
    super();
  }


  public SubStructElement(String id, String name, int position, Usage usage, Type type, String text,
      boolean custom, String maxLength, String minLength, String confLength, Ref ref, Set<Comment> comments) {
    super(id, name, position, usage, type, text, custom, comments);
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


  public LengthType getLengthType() {
    return lengthType;
  }


  public void setLengthType(LengthType lengthType) {
    this.lengthType = lengthType;
  }


  public StandardKey getConceptDomain() {
    return conceptDomain;
  }


  public void setConceptDomain(StandardKey conceptDomain) {
    this.conceptDomain = conceptDomain;
  }


  public String getConstantValue() {
    return constantValue;
  }


  public void setConstantValue(String constantValue) {
    this.constantValue = constantValue;
  }

}
