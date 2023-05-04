package gov.nist.hit.hl7.igamt.workspace.exception;

public class UsernameNotFound extends Exception {
    public UsernameNotFound(String username) {
        super("Username not found " + username);
    }
}
