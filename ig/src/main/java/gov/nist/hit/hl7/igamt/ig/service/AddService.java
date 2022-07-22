/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.ig.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface AddService {

AddMessageResponseObject addConformanceProfiles(Ig ig, List<AddingInfo> added, String username) throws EntityNotFound;

/**
 * @param ig
 * @param added
 * @param username
 * @return
 * @throws EntityNotFound
 */
AddMessageResponseObject addSegments(Ig ig, List<AddingInfo> added, String username)
    throws EntityNotFound;

/**
 * @param ig
 * @param added
 * @param username
 * @return
 * @throws EntityNotFound
 */
AddMessageResponseObject addDatatypes(Ig ig, List<AddingInfo> added, String username)
    throws EntityNotFound;
  
}
