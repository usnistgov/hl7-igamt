package gov.nist.hit.hl7.igamt.segment.domain.display;

import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentException;

public class SegmentStructure {
  private CompositeKey id;
  private String label;
  private String name;
  private Scope scope;
  private String version;
  private ResourceBinding binding;

  private Set<FieldDisplay> children;

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  public Set<FieldDisplay> getChildren() {
    return children;
  }

  public void setChildren(Set<FieldDisplay> children) {
    this.children = children;
  }

  public void addChild(FieldDisplay fieldDisplay) {
    if (this.children == null)
      this.children = new HashSet<FieldDisplay>();
    this.children.add(fieldDisplay);
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


  /**
   * TODO
   * 
   * @return
   * @throws SegmentException
   */
  public Segment toSegment() throws SegmentException {
    throw new SegmentException(id.getId(), "Operation not currently supported");
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }



}


class PositionCompForFieldDisplay implements Comparator<FieldDisplay> {
  @Override
  public int compare(FieldDisplay e1, FieldDisplay e2) {
    if (e1.getData().getPosition() > e2.getData().getPosition()) {
      return 1;
    } else {
      return -1;
    }
  }

}


