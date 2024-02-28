package gov.nist.hit.hl7.igamt.valueset.model;

import java.util.List;

public class CodeSetInfo {
	private String id;
	private CodeSetMetadata metadata;
	private List<CodeSetVersionInfo> children;
	
	
	public CodeSetInfo() {
		super();
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public CodeSetMetadata getMetadata() {
		return metadata;
	}
	public void setMetadata(CodeSetMetadata metadata) {
		this.metadata = metadata;
	}
	public List<CodeSetVersionInfo> getChildren() {
		return children;
	}
	public void setChildren(List<CodeSetVersionInfo> children) {
		this.children = children;
	}


}
