package gov.nist.hit.hl7.igamt.common.base.model;

import java.util.Date;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class DocumentSummary {

	private String title;
	private int position;
	private String coverpage;
	private String subtitle;
	private Date dateUpdated;
	private String id;
	private String username;
	private boolean derived; 
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

	public Boolean getDraft() {
		return draft;
	}

	public void setDraft(Boolean draft) {
		this.draft = draft;
	}
	

	public Boolean getDeprecated() {
		return deprecated;
	}

	public void setDeprecated(Boolean deprecated) {
		this.deprecated = deprecated;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCoverpage() {
		return coverpage;
	}

	public void setCoverpage(String coverpage) {
		this.coverpage = coverpage;
	}

	public String getSubtitle() {
		return subtitle;
	}

	public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(java.util.Date date) {
		this.dateUpdated = date;
	}

	public List<String> getElements() {
		return elements;
	}

	public void setElements(List<String> confrmanceProfiles) {
		this.elements = confrmanceProfiles;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public DocumentSummary() {
		// TODO Auto-generated constructor stub
	}

	public int getPosition() {
		return position;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<String> getParticipants() {
		return participants;
	}

	public void setParticipants(List<String> participants) {
		this.participants = participants;
	}

	public boolean isDerived() {
		return derived;
	}

	public void setDerived(boolean derived) {
		this.derived = derived;
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

	public Type getResourceType() {
		return resourceType;
	}

	public void setResourceType(Type resourceType) {
		this.resourceType = resourceType;
	}

	public PublicationInfo getPublicationInfo() {
		return publicationInfo;
	}

	public void setPublicationInfo(PublicationInfo publicationInfo) {
		this.publicationInfo = publicationInfo;
	}

}
