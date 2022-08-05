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

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface ResourceHelper {

  <T extends Resource> T getResourceByType(String id, Type type) throws EntityNotFound;

  /**
   * @return
   */
  String generateAbstractDomainId();

  /**
   * @return
   */
  Link generateLink(Resource resource, DocumentInfo info, int position);

  /**
   * @param resource
   * @param type
   * @return
   * @throws ForbiddenOperationException 
   */
  <T extends Resource> T saveByType(T resource, Type type) throws ForbiddenOperationException;
  
  
  
  

}
