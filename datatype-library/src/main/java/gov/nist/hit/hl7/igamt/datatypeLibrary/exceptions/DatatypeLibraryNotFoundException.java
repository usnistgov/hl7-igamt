package gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions;

import gov.nist.hit.hl7.igamt.common.base.exception.GenericException;

public class DatatypeLibraryNotFoundException extends GenericException {
  private static final long serialVersionUID = 1L;

  public DatatypeLibraryNotFoundException(String id) {
    super("data type library with id=" + id + " not found");
  }

  public DatatypeLibraryNotFoundException(Exception error) {
    super(error);
  }

}
