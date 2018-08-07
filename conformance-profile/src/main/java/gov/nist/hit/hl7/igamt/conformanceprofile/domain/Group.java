package gov.nist.hit.hl7.igamt.conformanceprofile.domain;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;


public class Group extends SegmentRefOrGroup {

  private Set<SegmentRefOrGroup> children = new HashSet<SegmentRefOrGroup>();

  public Group() {

    super();
    this.setType(Type.GROUP);
  }

  public Set<SegmentRefOrGroup> getChildren() {
    return children;
  }

  public void setChildren(Set<SegmentRefOrGroup> children) {
    this.children = children;
  }

}
