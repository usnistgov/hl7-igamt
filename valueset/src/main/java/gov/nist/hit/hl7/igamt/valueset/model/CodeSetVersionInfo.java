package gov.nist.hit.hl7.igamt.valueset.model;

import java.util.Date;


import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class CodeSetVersionInfo {

	private String id;
	private Type type;
	private String version;
	private String comments;
	private String parentId;
	private String parentName;
	private Date dateCreated;
	private Date dateCommitted;
	private Date dateUpdated;
	private boolean isLatestStable;

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public CodeSetVersionInfo() {
		super();
		this.type = Type.CODESETVERSION;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public Date getDateCommitted() {
		return dateCommitted;
	}

	public void setDateCommitted(Date dateCommitted) {
		this.dateCommitted = dateCommitted;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public boolean isLatestStable() {
		return isLatestStable;
	}

	public void setLatestStable(boolean latestStable) {
		isLatestStable = latestStable;
	}
}
