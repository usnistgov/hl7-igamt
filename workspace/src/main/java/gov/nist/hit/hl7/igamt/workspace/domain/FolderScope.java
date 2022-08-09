package gov.nist.hit.hl7.igamt.workspace.domain;

import java.util.Set;

public class FolderScope extends WorkspaceScope {
    private Set<String> folderId;

    public FolderScope() {
        super(WorkspaceScopeType.FOLDER);
    }

    public Set<String> getFolderId() {
        return folderId;
    }

    public void setFolderId(Set<String> folderId) {
        this.folderId = folderId;
    }
}
