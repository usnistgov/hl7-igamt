package gov.nist.hit.hl7.igamt.workspace.model;

import gov.nist.hit.hl7.igamt.workspace.domain.UserAccessInfo;

public class WorkspaceAccessInfo {
    private UserAccessInfo userAccessInfo;
    private String username;

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
