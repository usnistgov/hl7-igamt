package gov.nist.hit.hl7.igamt.workspace.domain;

import java.util.HashSet;
import java.util.Set;

public class UserAccessInfo {
    private Set<WorkspaceUser> users;

    public Set<WorkspaceUser> getUsers() {
        if(users == null) {
            users = new HashSet<>();
        }
        return users;
    }

    public void setUsers(Set<WorkspaceUser> users) {
        this.users = users;
    }
}
