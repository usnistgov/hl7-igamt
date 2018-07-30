package gov.nist.hit.hl7.igamt.datatype.domain.display;

import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;


public class DatatypeStructure {
  private CompositeKey id;
  private String label;
  private Scope scope;
  private String version;
  private ResourceBinding binding;

  private Set<ComponentDisplay> structure;

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  public Set<ComponentDisplay> getChildren() {
    return structure;
  }

  public void setChildren(Set<ComponentDisplay> structure) {
    this.structure = structure;
  }

  public void addChild(ComponentDisplay componentDisplay) {
    if (this.structure == null)
      this.structure = new HashSet<ComponentDisplay>();
    this.structure.add(componentDisplay);
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public ResourceBinding getBinding() {
    return binding;
  }

  public void setBinding(ResourceBinding binding) {
    this.binding = binding;
  }


}


class PositionCompForComponentDisplay implements Comparator<ComponentDisplay> {
  @Override
  public int compare(ComponentDisplay e1, ComponentDisplay e2) {
    if (e1.getData().getPosition() > e2.getData().getPosition()) {
      return 1;
    } else {
      return -1;
    }
  }
}
