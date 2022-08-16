package gov.nist.hit.hl7.igamt.workspace.model;

import gov.nist.hit.hl7.igamt.workspace.domain.UserAccessInfo;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceAccessType;

public class WorkspaceAccessInfo {
    private WorkspaceAccessType accessType;
    private UserAccessInfo userAccessInfo;
    private String username;

    public WorkspaceAccessType getAccessType() {
        return accessType;
    }

    public void setAccessType(WorkspaceAccessType accessType) {
        this.accessType = accessType;
    }

    public UserAccessInfo getUserAccessInfo() {
        return userAccessInfo;
    }

    public void setUserAccessInfo(UserAccessInfo userAccessInfo) {
        this.userAccessInfo = userAccessInfo;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
