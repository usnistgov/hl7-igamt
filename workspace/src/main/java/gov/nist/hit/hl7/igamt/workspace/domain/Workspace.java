package gov.nist.hit.hl7.igamt.workspace.domain;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "workspace")
public class Workspace {
	@Id
	private String id;
	private WorkspaceAccessType accessType;
	private WorkspaceMetadata metadata;
	private UserAccessInfo userAccessInfo;
	private Set<DocumentLink>  documents;
	private Set<Folder>  folders;
	private String homePageContent;
	// Owner
	private String username;
	@CreatedDate
	private Date creationDate;
	private Date updateDate;
	
	
	public Workspace() {
		super();
		folders = new HashSet<>();
		documents = new HashSet<>();
	}

	public String getHomePageContent() {
		return homePageContent;
	}
	public void setHomePageContent(String homePageContent) {
		this.homePageContent = homePageContent;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public WorkspaceAccessType getAccessType() {
		return accessType;
	}
	public void setAccessType(WorkspaceAccessType accessType) {
		this.accessType = accessType;
	}
	public WorkspaceMetadata getMetadata() {
		return metadata;
	}
	public void setMetadata(WorkspaceMetadata metadata) {
		this.metadata = metadata;
	}
	public UserAccessInfo getUserAccessInfo() {
		return userAccessInfo;
	}
	public void setUserAccessInfo(UserAccessInfo userAccessInfo) {
		this.userAccessInfo = userAccessInfo;
	}
	public Set<DocumentLink> getDocuments() {
		return documents;
	}
	public void setDocuments(Set<DocumentLink> documents) {
		this.documents = documents;
	}
	public Set<Folder> getFolders() {
		return folders;
	}
	public void setFolders(Set<Folder> folders) {
		this.folders = folders;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
}
