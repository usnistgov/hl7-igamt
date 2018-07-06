package gov.nist.hit.hl7.igamt.ig.exceptions;

public class IGNotFoundException extends Exception {
  private static final long serialVersionUID = 1L;

  public IGNotFoundException(String id) {
    super("Ig document with id=" + id + " not found");
  }

  public IGNotFoundException(Exception error) {
    super(error);
  }

}
