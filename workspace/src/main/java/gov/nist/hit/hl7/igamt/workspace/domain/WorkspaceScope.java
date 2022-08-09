package gov.nist.hit.hl7.igamt.workspace.domain;

abstract public class WorkspaceScope {
    private WorkspaceScopeType type;

    public WorkspaceScope() {
    }

    public WorkspaceScope(WorkspaceScopeType type) {
        this.type = type;
    }

    public WorkspaceScopeType getType() {
        return type;
    }

    public void setType(WorkspaceScopeType type) {
        this.type = type;
    }
}
