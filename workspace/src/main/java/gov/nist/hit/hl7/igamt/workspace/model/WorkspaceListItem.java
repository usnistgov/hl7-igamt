package gov.nist.hit.hl7.igamt.workspace.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class WorkspaceListItem {

	String id;
	String title;
	int position;
	String coverPicture;
	String description;
	String dateUpdated;
	String username;
	Type resourceType;
	boolean invitation;


	public WorkspaceListItem() {
		super();
		this.resourceType= Type.WORKSPACE;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	public String getCoverPicture() {
		return coverPicture;
	}
	public void setCoverPicture(String coverPicture) {
		this.coverPicture = coverPicture;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Type getResourceType() {
		return resourceType;
	}

	public void setResourceType(Type resourceType) {
		this.resourceType = resourceType;
	}

	public String getDateUpdated() {
		return dateUpdated;
	}
	public void setDateUpdated(String dateUpdated) {
		this.dateUpdated = dateUpdated;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}

	public boolean isInvitation() {
		return invitation;
	}

	public void setInvitation(boolean invitation) {
		this.invitation = invitation;
	}
}
