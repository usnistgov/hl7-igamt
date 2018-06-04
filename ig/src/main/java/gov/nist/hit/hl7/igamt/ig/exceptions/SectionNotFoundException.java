package gov.nist.hit.hl7.igamt.ig.exceptions;

public class SectionNotFoundException extends Exception {
  private static final long serialVersionUID = 1L;

  public SectionNotFoundException(String error) {
    super(error);
  }

  public SectionNotFoundException(Exception error) {
    super(error);
  }

}
