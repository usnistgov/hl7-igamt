package gov.nist.hit.hl7.igamt.workspace.domain;

public class WorkspaceMetadata {

	private String title; 
	private String description;
	private String coverPicture;
	
	
	
	public WorkspaceMetadata() {
		super();
	}
	
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCoverPicture() {
		return coverPicture;
	}
	public void setCoverPicture(String coverPicture) {
		this.coverPicture = coverPicture;
	}

	
	
}
