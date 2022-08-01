package gov.nist.hit.hl7.igamt.workspace.domain;

import java.util.HashSet;
import java.util.Set;

public class Folder {

	private String id; 
	private int position;
	private WorkspaceMetadata metadata;
	private Set<DocumentLink> children;

	public Folder() {
		super();
		children = new HashSet<DocumentLink>();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public WorkspaceMetadata getMetadata() {
		return metadata;
	}

	public void setMetadata(WorkspaceMetadata metadata) {
		this.metadata = metadata;
	}

	public Set<DocumentLink> getChildren() {
		return children;
	}

	public void setChildren(Set<DocumentLink> children) {
		this.children = children;
	}
	
}
