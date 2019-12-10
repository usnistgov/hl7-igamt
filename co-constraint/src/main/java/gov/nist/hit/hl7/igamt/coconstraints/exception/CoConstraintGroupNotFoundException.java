package gov.nist.hit.hl7.igamt.coconstraints.exception;

public class CoConstraintGroupNotFoundException extends Exception {

    public CoConstraintGroupNotFoundException(String id) {
        super("Co Constraint Group with id " + id + " not found");
    }

}
