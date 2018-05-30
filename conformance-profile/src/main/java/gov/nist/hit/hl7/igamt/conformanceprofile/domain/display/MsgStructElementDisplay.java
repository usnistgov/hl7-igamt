package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.TreeSet;

import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;


public class MsgStructElementDisplay {
  private MsgStructElement data;

  private TreeSet<MsgStructElementDisplay> children;

  public MsgStructElement getData() {
    return data;
  }

  public void setData(MsgStructElement data) {
    this.data = data;
  }

  public TreeSet<MsgStructElementDisplay> getChildren() {
    return children;
  }

  public void setChildren(TreeSet<MsgStructElementDisplay> children) {
    this.children = children;
  }

  public void addChild(MsgStructElementDisplay msgStructElementDisplay) {
    if (this.children == null)
      this.children =
          new TreeSet<MsgStructElementDisplay>(new PositionCompForMsgStructElementDisplay());
    this.children.add(msgStructElementDisplay);
  }

}
