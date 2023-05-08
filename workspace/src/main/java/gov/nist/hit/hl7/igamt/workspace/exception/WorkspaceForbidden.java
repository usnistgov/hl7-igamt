package gov.nist.hit.hl7.igamt.workspace.exception;

public class WorkspaceForbidden extends Exception {
    public WorkspaceForbidden() {
        super("You do not have permission to perform this action, please contact admin.");
    }
}
