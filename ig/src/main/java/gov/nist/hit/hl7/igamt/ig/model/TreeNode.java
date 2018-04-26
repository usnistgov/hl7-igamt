package gov.nist.hit.hl7.igamt.ig.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TreeNode implements Comparable<TreeNode>{
	
	private TreeData data; 
	private List<TreeNode>  children;
	private boolean isExpanded =false;
	
	public TreeNode() {
		children=new ArrayList<TreeNode>();
	}
	public TreeData getData() {
		return data;
	}
	public void setData(TreeData data) {
		this.data = data;
	}
	public List<TreeNode> getChildren() {
		return children;
	}
	public void setChildren(List<TreeNode> children) {
		this.children = children;
	}
	@Override
	public int compareTo(TreeNode o) {
		// TODO Auto-generated method stub
		return this.getData().getPosition()-o.getData().getPosition();
	}
    @JsonProperty(value="isExpanded")        
	public boolean isExpanded() {
		return isExpanded;
	}
	public void setExpanded(boolean isExpanded) {
		this.isExpanded = isExpanded;
	} 

}
