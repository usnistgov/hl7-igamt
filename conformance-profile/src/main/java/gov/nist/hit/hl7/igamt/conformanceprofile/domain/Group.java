package gov.nist.hit.hl7.igamt.conformanceprofile.domain;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;


public class Group extends MsgStructElement {

  private Set<MsgStructElement> children = new HashSet<MsgStructElement>();

  public Group() {

    super();
    this.setType(Type.GROUP);
  }

  public Group(String id, String name, int position, Usage usage, String text, boolean custom,
      int min, String max, Set<MsgStructElement> children) {
    super(id, name, position, usage, Type.GROUP, text, custom, min, max);
    this.children = children;
  }

  public Set<MsgStructElement> getChildren() {
    return children;
  }

  public void setChildren(Set<MsgStructElement> children) {
    this.children = children;
  }

}
