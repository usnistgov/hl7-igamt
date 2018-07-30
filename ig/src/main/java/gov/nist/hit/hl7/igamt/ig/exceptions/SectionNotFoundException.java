package gov.nist.hit.hl7.igamt.ig.exceptions;

import gov.nist.hit.hl7.igamt.common.base.exception.GenericException;

public class SectionNotFoundException extends GenericException {
  private static final long serialVersionUID = 1L;

  public SectionNotFoundException(String error) {
    super(error);
  }

  public SectionNotFoundException(Exception error) {
    super(error);
  }

}
