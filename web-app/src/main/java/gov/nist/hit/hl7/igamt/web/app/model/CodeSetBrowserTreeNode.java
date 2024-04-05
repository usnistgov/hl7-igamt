package gov.nist.hit.hl7.igamt.web.app.model;

import java.util.List;

public class CodeSetBrowserTreeNode {
	private CodeSetBrowserTreeNodeData data;
	private List<CodeSetVersionBrowserTreeNode> children;

	public CodeSetBrowserTreeNodeData getData() {
		return data;
	}

	public void setData(CodeSetBrowserTreeNodeData data) {
		this.data = data;
	}

	public List<CodeSetVersionBrowserTreeNode> getChildren() {
		return children;
	}

	public void setChildren(List<CodeSetVersionBrowserTreeNode> children) {
		this.children = children;
	}
}
