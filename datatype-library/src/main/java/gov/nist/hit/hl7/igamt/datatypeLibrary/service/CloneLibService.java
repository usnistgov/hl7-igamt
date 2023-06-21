package gov.nist.hit.hl7.igamt.datatypeLibrary.service;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface CloneLibService {

  public DatatypeLibrary clone(DatatypeLibrary lib, String username, CopyInfo info) throws EntityNotFound, ForbiddenOperationException;

}
