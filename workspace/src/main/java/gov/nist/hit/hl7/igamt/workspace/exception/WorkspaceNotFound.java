package gov.nist.hit.hl7.igamt.workspace.exception;

public class WorkspaceNotFound extends Exception {
    public WorkspaceNotFound(String workspaceId) {
        super("Workspace ID = " + workspaceId + " not found");
    }
}
