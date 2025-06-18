package gov.nist.hit.hl7.igamt.valueset.exception;

public class CodeSetNotFound extends Exception {
    private static final long serialVersionUID = 1L;

	public CodeSetNotFound(String codeSetId) {
        super("CodeSet ID = " + codeSetId + " not found");
    }
}
