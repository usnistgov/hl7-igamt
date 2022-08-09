package gov.nist.hit.hl7.igamt.workspace.domain;

import java.util.Date;
import java.util.Objects;

public class WorkspaceUser {
    private String username;
    private String invitedBy;
    private Date joined;
    private Date added;
    private WorkspacePermissions permissions;
    private boolean pending;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getJoined() {
        return joined;
    }

    public void setJoined(Date joined) {
        this.joined = joined;
    }

    public Date getAdded() {
        return added;
    }

    public void setAdded(Date added) {
        this.added = added;
    }

    public WorkspacePermissions getPermissions() {
        return permissions;
    }

    public void setPermissions(WorkspacePermissions permissions) {
        this.permissions = permissions;
    }

    public boolean isPending() {
        return pending;
    }

    public void setPending(boolean pending) {
        this.pending = pending;
    }

    public String getInvitedBy() {
        return invitedBy;
    }

    public void setInvitedBy(String invitedBy) {
        this.invitedBy = invitedBy;
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }
}
