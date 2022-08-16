package gov.nist.hit.hl7.igamt.web.app.model;

import java.util.List;

public class BrowserTreeNode {
    private BrowserTreeNodeData data;
    private List<BrowserTreeNode> children;

    public BrowserTreeNodeData getData() {
        return data;
    }

    public void setData(BrowserTreeNodeData data) {
        this.data = data;
    }

    public List<BrowserTreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<BrowserTreeNode> children) {
        this.children = children;
    }
}
