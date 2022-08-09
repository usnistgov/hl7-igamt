package gov.nist.hit.hl7.igamt.workspace.domain;

import java.util.Set;

public class UserAccessInfo {
    private Set<WorkspaceUser> users;

    public Set<WorkspaceUser> getUsers() {
        return users;
    }

    public void setUsers(Set<WorkspaceUser> users) {
        this.users = users;
    }
}
