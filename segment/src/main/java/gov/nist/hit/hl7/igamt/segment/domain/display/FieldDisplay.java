package gov.nist.hit.hl7.igamt.segment.domain.display;

import java.util.Comparator;
import java.util.TreeSet;

public class FieldDisplay {
  private FieldDisplayData data;

  private TreeSet<ComponentDisplay> children;

  public void addChild(ComponentDisplay componentDisplay) {
    if (this.children == null)
      this.children = new TreeSet<ComponentDisplay>(new PositionCompForComponentDisplay());
    this.children.add(componentDisplay);

  }

  public TreeSet<ComponentDisplay> getChildren() {
    return children;
  }

  public void setChildren(TreeSet<ComponentDisplay> children) {
    this.children = children;
  }

  public FieldDisplayData getData() {
    return data;
  }

  public void setData(FieldDisplayData data) {
    this.data = data;
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
