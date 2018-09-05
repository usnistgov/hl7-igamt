package gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions;

import gov.nist.hit.hl7.igamt.common.base.exception.GenericException;

/**
 * @author ena3
 *
 */
public class DatatypeLibraryConverterException extends GenericException {
  private static final long serialVersionUID = 1L;

  public DatatypeLibraryConverterException(String message) {
    super(message);
  }

  public DatatypeLibraryConverterException(Exception error) {
    super(error);
  }

}
