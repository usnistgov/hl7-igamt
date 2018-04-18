package gov.nist.hit.hl7.igamt.ig.model;

import java.util.ArrayList;
import java.util.List;

public class IgToc {
	private List<TreeNode> content=new ArrayList<TreeNode>();
	public List<TreeNode> getContent() {
		return content;
	}
	public void setContent(List<TreeNode> content) {
		this.content = content;
	}
	public IgToc() {
		// TODO Auto-generated constructor stub
	}

}
