package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.Map;
import java.util.Set;

import gov.nist.diff.annotation.DeltaField;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;

// @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
// @JsonSubTypes({@JsonSubTypes.Type(value = Group.class, name = "GROUP"),
// @JsonSubTypes.Type(value = SegmentRef.class, name = "SEGMENTREF")})
public class MsgStructElement extends StructureElement {
  @DeltaField
  private int min;
  @DeltaField
  private String max;

  public MsgStructElement() {
    super();

  }

  public MsgStructElement(String id, String name, int position, Usage usage, Type type, String text,
      boolean custom, int min, String max, Set<Comment> comments) {
    super(id, name, position, usage, type, text, custom, comments);
    this.min = min;
    this.max = max;
  }


  public int getMin() {
    return min;
  }

  public void setMin(int min) {
    this.min = min;
  }

  public String getMax() {
    return max;
  }

  public void setMax(String max) {
    this.max = max;
  }


  
}
