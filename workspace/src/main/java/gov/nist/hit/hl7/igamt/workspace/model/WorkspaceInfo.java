package gov.nist.hit.hl7.igamt.workspace.model;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceMetadata;

import java.util.Date;
import java.util.Set;

public class WorkspaceInfo {
    private String id;
    private boolean admin;
    private WorkspaceMetadata metadata;
    private String homePageContent;
    private String owner;
    private Set<FolderInfo> folders;
    private Date created;
    private Date updated;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public WorkspaceMetadata getMetadata() {
        return metadata;
    }

    public void setMetadata(WorkspaceMetadata metadata) {
        this.metadata = metadata;
    }

    public String getHomePageContent() {
        return homePageContent;
    }

    public void setHomePageContent(String homePageContent) {
        this.homePageContent = homePageContent;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Set<FolderInfo> getFolders() {
        return folders;
    }

    public void setFolders(Set<FolderInfo> folders) {
        this.folders = folders;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }
}
