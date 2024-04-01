package gov.nist.hit.hl7.igamt.web.app.model;

import java.util.List;

public class CodeSetBrowserTreeNode {
	private CodeSetBrowserTreeNodeData data;
	private List<BrowserTreeNode> children;

	public CodeSetBrowserTreeNodeData getData() {
		return data;
	}

	public void setData(CodeSetBrowserTreeNodeData data) {
		this.data = data;
	}

	public List<BrowserTreeNode> getChildren() {
		return children;
	}

	public void setChildren(List<BrowserTreeNode> children) {
		this.children = children;
	}
}
