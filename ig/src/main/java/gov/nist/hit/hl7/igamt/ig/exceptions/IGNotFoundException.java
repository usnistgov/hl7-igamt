package gov.nist.hit.hl7.igamt.ig.exceptions;

import gov.nist.hit.hl7.igamt.common.base.exception.GenericException;

public class IGNotFoundException extends GenericException {
  private static final long serialVersionUID = 1L;

  public IGNotFoundException(String id) {
    super("Ig document with id=" + id + " not found");
  }

  public IGNotFoundException(Exception error) {
    super(error);
  }

}
