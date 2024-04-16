package gov.nist.hit.hl7.igamt.valueset.model;

import java.util.Date;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class CodeSetListItem {

	private String title;
	private int position;
	private Date dateUpdated;
	private String id;
	private String username;
	private List<String> participants;
	private Status status;
	private List<String> elements;
	private SharePermission sharePermission;
	private Set<String> sharedUsers;
	private String currentAuthor;
	private Boolean draft;
	private Type resourceType;
	private PublicationInfo publicationInfo;
	private Boolean deprecated;	
	private List<CodeSetVersionListInfo> children; 
	
	public CodeSetListItem() {
		super();
		this.resourceType= Type.CODESET;
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

	public Date getDateUpdated() {
		return dateUpdated;
	}
	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}
	public List<String> getParticipants() {
		return participants;
	}
	public void setParticipants(List<String> participants) {
		this.participants = participants;
	}
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public List<String> getElements() {
		return elements;
	}
	public void setElements(List<String> elements) {
		this.elements = elements;
	}
	public SharePermission getSharePermission() {
		return sharePermission;
	}
	public void setSharePermission(SharePermission sharePermission) {
		this.sharePermission = sharePermission;
	}
	public Set<String> getSharedUsers() {
		return sharedUsers;
	}
	public void setSharedUsers(Set<String> sharedUsers) {
		this.sharedUsers = sharedUsers;
	}
	public String getCurrentAuthor() {
		return currentAuthor;
	}
	public void setCurrentAuthor(String currentAuthor) {
		this.currentAuthor = currentAuthor;
	}
	public Boolean getDraft() {
		return draft;
	}
	public void setDraft(Boolean draft) {
		this.draft = draft;
	}
	public PublicationInfo getPublicationInfo() {
		return publicationInfo;
	}
	public void setPublicationInfo(PublicationInfo publicationInfo) {
		this.publicationInfo = publicationInfo;
	}
	public Boolean getDeprecated() {
		return deprecated;
	}
	public void setDeprecated(Boolean deprecated) {
		this.deprecated = deprecated;
	}
	public Type getResourceType() {
		return resourceType;
	}

	public void setResourceType(Type resourceType) {
		this.resourceType = resourceType;
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
	public List<CodeSetVersionListInfo> getChildren() {
		return children;
	}
	public void setChildren(List<CodeSetVersionListInfo> children) {
		this.children = children;
	}


}
