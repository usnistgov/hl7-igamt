package gov.nist.hit.hl7.igamt.workspace.exception;

import java.util.List;

public class CreateRequestException extends Exception {
    public CreateRequestException(List<String> errors) {
        super(String.join(", ", errors));
    }
}
