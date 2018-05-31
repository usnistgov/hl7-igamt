package gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display;

import java.util.ArrayList;
import java.util.List;


public class MessageEventTreeNode {
  private MessageEventTreeData data;
  private List<EventTreeNode> children = new ArrayList<EventTreeNode>();

  public MessageEventTreeNode() {}

  public MessageEventTreeData getData() {
    return data;
  }

  public void setData(MessageEventTreeData data) {
    this.data = data;
  }

  public List<EventTreeNode> getChildren() {
    return children;
  }

  public void setChildren(List<EventTreeNode> children) {
    this.children = children;
  }


}
