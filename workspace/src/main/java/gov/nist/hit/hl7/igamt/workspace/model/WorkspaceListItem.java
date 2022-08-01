package gov.nist.hit.hl7.igamt.workspace.model;

import java.util.List;

import ch.qos.logback.core.status.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class WorkspaceListItem {

	  String title;
	  int position;
	  String coverPicture;
	  String string;
	  String dateUpdated;
//	  type: IWorkspaceListItemType;
	  String id;
	  String username;
	  List<String> elements;
	  Status status;
	  Type resourceType;
//	  List<String> sharedUsers: string[];
	  
	  
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
	public String getString() {
		return string;
	}
	public void setString(String string) {
		this.string = string;
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
	public List<String> getElements() {
		return elements;
	}
	public void setElements(List<String> elements) {
		this.elements = elements;
	}
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	
	
}
