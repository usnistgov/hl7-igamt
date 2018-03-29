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

  public Group(String id, String name, int position, Usage usage, String text,
      boolean custom, int min, String max, Set<MsgStructElement> children, ResourceBinding binding) {
    super(id, name, position, usage, Type.GROUP, text, custom, min, max);
    this.children = children;
    this.binding = binding;
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
