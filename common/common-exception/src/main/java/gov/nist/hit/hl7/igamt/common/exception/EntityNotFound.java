package gov.nist.hit.hl7.igamt.common.exception;

public class EntityNotFound extends Exception {

    /**
   * 
   */
  private static final long serialVersionUID = 1L;

    public EntityNotFound(String id) {
        super("Entity with id " + id + " not found");
    }

}
