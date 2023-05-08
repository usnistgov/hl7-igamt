package gov.nist.hit.hl7.igamt.web.app.model;

import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;

import java.util.Objects;

public class ActiveUser {
    String username;
    String id;
    SharePermission mode;

    public ActiveUser() {
    }

    public ActiveUser(String id, String username, SharePermission mode) {
        this.username = username;
        this.mode = mode;
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public SharePermission getMode() {
        return mode;
    }

    public void setMode(SharePermission mode) {
        this.mode = mode;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ActiveUser that = (ActiveUser) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
