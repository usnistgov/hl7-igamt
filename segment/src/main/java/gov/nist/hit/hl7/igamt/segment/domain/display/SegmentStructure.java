package gov.nist.hit.hl7.igamt.segment.domain.display;

import java.util.Comparator;
import java.util.TreeSet;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentException;

public class SegmentStructure {
  private CompositeKey id;
  private String label;
  private Scope scope;
  private String version;
  private ResourceBinding binding;

  private TreeSet<FieldDisplay> structure;

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  public TreeSet<FieldDisplay> getChildren() {
    return structure;
  }

  public void setChildren(TreeSet<FieldDisplay> structure) {
    this.structure = structure;
  }

  public void addChild(FieldDisplay fieldDisplay) {
    if (this.structure == null)
      this.structure = new TreeSet<FieldDisplay>(new PositionCompForFieldDisplay());
    this.structure.add(fieldDisplay);
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


