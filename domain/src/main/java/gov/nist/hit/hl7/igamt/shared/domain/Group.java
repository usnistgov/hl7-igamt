package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.binding.ResourceBinding;

public class Group extends MsgStructElement {

  private Set<MsgStructElement> children = new HashSet<MsgStructElement>();
  private ResourceBinding binding;

  public Group() {

    super();
    this.setType(Type.GROUP);
  }

  public Set<MsgStructElement> getChildren() {
    return children;
  }

  public void setChildren(Set<MsgStructElement> children) {
    this.children = children;
  }

  public ResourceBinding getBinding() {
    return binding;
  }

  public void setBinding(ResourceBinding binding) {
    this.binding = binding;
  }

}
