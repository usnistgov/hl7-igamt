package gov.nist.hit.hl7.igamt.ig.exceptions;

import gov.nist.hit.hl7.igamt.common.base.exception.GenericException;

public class PredicateNotFoundException extends GenericException {
  private static final long serialVersionUID = 1L;

  public PredicateNotFoundException(String id) {
    super("Predicate with id=" + id + " not found");
  }

  public PredicateNotFoundException(Exception error) {
    super(error);
  }

}
