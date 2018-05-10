package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ResourceBinding;

public class ConformanceProfileStructure {
  private CompositeKey id;
  private String label;
  private Scope scope;
  private String version;
  private ResourceBinding binding;

//  private TreeSet<ComponentDisplay> structure;

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

//  public TreeSet<ComponentDisplay> getChildren() {
//    return structure;
//  }
//
//  public void setChildren(TreeSet<ComponentDisplay> structure) {
//    this.structure = structure;
//  }
//
//  public void addChild(ComponentDisplay componentDisplay) {
//    if (this.structure == null)
//      this.structure = new TreeSet<ComponentDisplay>(new PositionCompForComponentDisplay());
//    this.structure.add(componentDisplay);
//  }

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


//class PositionCompForComponentDisplay implements Comparator<ComponentDisplay> {
//  @Override
//  public int compare(ComponentDisplay e1, ComponentDisplay e2) {
//    if (e1.getData().getPosition() > e2.getData().getPosition()) {
//      return 1;
//    } else {
//      return -1;
//    }
//  }
//}
