package gov.nist.hit.hl7.igamt.xreference.model;

import java.util.List;

public class CrossRefsNode {
	
	private CrossRefsLabel label;
	
	private CrossRef data ;
	
	private List<CrossRefsNode> children;
	
	
	public CrossRefsNode() {
		super();
	}
	
	public List<CrossRefsNode> getChildren() {
		return children;
	}
	
	public void setChildren(List<CrossRefsNode> children) {
		this.children = children;
	}
	
	public CrossRef getData() {
		return data;
	}
	
	public void setData(CrossRef data) {
		this.data = data;
	}
	
	public CrossRefsLabel getLabel() {
		return label;
	}
	
	public void setLabel(CrossRefsLabel node) {
		this.label = node;
	}

	
	
}
