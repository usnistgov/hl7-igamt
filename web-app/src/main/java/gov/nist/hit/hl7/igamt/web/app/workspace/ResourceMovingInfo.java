package gov.nist.hit.hl7.igamt.web.app.workspace;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ResourceMovingInfo {
	
	private Type resourceType;
	private String resourceId;
	private String folderId;

	public Type getResourceType() {
		return resourceType;
	}
	public void setResourceType(Type resourceType) {
		this.resourceType = resourceType;
	}
	public String getResourceId() {
		return resourceId;
	}
	public void setResourceId(String resourceId) {
		this.resourceId = resourceId;
	}
	public String getFolderId() {
		return folderId;
	}
	public void setFolderId(String folderId) {
		this.folderId = folderId;
	}
	public ResourceMovingInfo() {
		super();
	}


}
