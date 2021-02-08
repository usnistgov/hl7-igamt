package gov.nist.hit.hl7.igamt.common.change.entity.exception;

public class InvalidChangeTargetLocation extends Exception {

    public InvalidChangeTargetLocation(String location) {
        super(location);
    }
}
