package gov.nist.hit.hl7.igamt.conformanceprofile.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;

import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = As.PROPERTY, property = "type")
@JsonSubTypes({@JsonSubTypes.Type(value = Group.class, name = "GROUP"),
    @JsonSubTypes.Type(value = SegmentRef.class, name = "SEGMENTREF")})
public class SegmentRefOrGroup extends MsgStructElement {
  public SegmentRefOrGroup() {
    super();
  }

}
