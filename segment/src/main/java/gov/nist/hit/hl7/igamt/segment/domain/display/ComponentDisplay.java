package gov.nist.hit.hl7.igamt.segment.domain.display;

import java.util.Comparator;
import java.util.TreeSet;

public class ComponentDisplay {
  private ComponentDisplayData data;

  private TreeSet<SubComponentDisplay> children;


  public TreeSet<SubComponentDisplay> getChildren() {
    return children;
  }

  public void setChildren(TreeSet<SubComponentDisplay> children) {
    this.children = children;
  }

  public void addChild(SubComponentDisplay subComponentDisplay) {
    if (this.children == null)
      this.children = new TreeSet<SubComponentDisplay>(new PositionCompForSubComponentDisplay());
    this.children.add(subComponentDisplay);
  }

  public ComponentDisplayData getData() {
    return data;
  }

  public void setData(ComponentDisplayData data) {
    this.data = data;
  }

}


class PositionCompForSubComponentDisplay implements Comparator<SubComponentDisplay> {
  @Override
  public int compare(SubComponentDisplay e1, SubComponentDisplay e2) {
    if (e1.getData().getPosition() > e2.getData().getPosition()) {
      return 1;
    } else {
      return -1;
    }
  }
}
